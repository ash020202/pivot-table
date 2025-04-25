import { ColumnDef } from "@tanstack/react-table";

import { DataRow, PivotFunctionProps } from "./types";

export function generatePivotData({
  rawData,
  rowFields = [],
  columnFields = [],
  measureFields = [],
  aggregation = ["SUM"],
  measureAggregations = {},
}: PivotFunctionProps): DataRow[] {
  if (
    !rawData.length ||
    (!rowFields.length && !columnFields.length && !measureFields.length)
  ) {
    return rawData;
  }

  const grouped: Record<string, Record<string, number[]>> = {};
  const allColumnKeys = new Set<string>();

  const resultMap: Map<string, DataRow> = new Map();

  rawData.forEach((row) => {
    const rowKey = rowFields
      .map((field) => formatCellValue(row[field]))
      .join(" | ");
    const colKey = columnFields.length
      ? columnFields.map((field) => formatCellValue(row[field])).join(" | ")
      : "";

    const rowObj = resultMap.get(rowKey) || {};

    // Set row fields
    rowFields.forEach((field) => {
      rowObj[field] = formatCellValue(row[field]);
    });

    // If no measure, just track existence of row + column
    if (!measureFields.length) {
      const finalColKey = colKey || "Count";
      const prev = Number(rowObj[finalColKey]) || 0;
      rowObj[finalColKey] = prev + 1;

      allColumnKeys.add(finalColKey);
      resultMap.set(rowKey, rowObj);
      return;
    }

    // If measures exist, aggregate based on per-measure aggregation types
    measureFields.forEach((measure) => {
      // Use measure-specific aggregations if available, otherwise use global
      const aggTypesToUse = measureAggregations[measure] || aggregation;

      aggTypesToUse.forEach((aggType) => {
        const finalColKey = colKey
          ? `${colKey} | ${aggType} of ${measure}`
          : `${aggType} of ${measure}`;
        console.log("Creating column:", finalColKey);
        const value = Number(row[measure]) || 0;

        if (!grouped[rowKey]) grouped[rowKey] = {};
        if (!grouped[rowKey][finalColKey]) {
          grouped[rowKey][finalColKey] = [];
        }

        grouped[rowKey][finalColKey].push(value);
        allColumnKeys.add(finalColKey);

        resultMap.set(rowKey, rowObj);
      });
    });
  });

  const result: DataRow[] = [];

  for (const [rowKey, rowObj] of resultMap.entries()) {
    const values = grouped[rowKey];

    if (values) {
      Object.entries(values).forEach(([colKey, valArray]) => {
        let agg = 0;
        if (colKey.includes("SUM")) {
          agg = valArray.reduce((a, b) => a + b, 0);
        } else if (colKey.includes("AVG")) {
          agg = valArray.reduce((a, b) => a + b, 0) / valArray.length;
        } else if (colKey.includes("COUNT")) {
          agg = valArray.length;
        }
        rowObj[colKey] = formatCellValue(agg);
      });
    }

    // Fill 0 for missing columns
    allColumnKeys.forEach((colKey) => {
      if (!rowObj.hasOwnProperty(colKey)) {
        rowObj[colKey] = formatCellValue(0);
      }
    });

    result.push(rowObj);
    console.log(result);
  }

  // Add Grand Total row if any rowFields or columnFields are selected
  if (rowFields.length || columnFields.length) {
    const grandTotal: DataRow = {};

    // Set "Grand Total" label
    rowFields.forEach((field, index) => {
      grandTotal[field] = index === 0 ? "Grand Total" : "";
    });

    allColumnKeys.forEach((colKey) => {
      const values: number[] = [];

      result.forEach((row) => {
        const val = Number(row[colKey]);
        if (!isNaN(val)) values.push(val);
      });

      let aggValue = 0;

      // COUNT only logic (when no measureFields)
      if (!measureFields.length) {
        aggValue = values.reduce((a, b) => a + b, 0);
      } else {
        if (colKey.includes("SUM")) {
          aggValue = values.reduce((a, b) => a + b, 0);
        } else if (colKey.includes("AVG")) {
          // For grand total of averages, we average the averages
          aggValue = values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;
        } else if (colKey.includes("COUNT") || colKey === "Count") {
          aggValue = values.reduce((a, b) => a + b, 0);
        }
      }

      grandTotal[colKey] = formatCellValue(aggValue);
    });

    result.push(grandTotal);
  }

  return result;
}

export function formatCellValue(value: any): string | number {
  // First check if it's already a Date object
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB");
  }

  // For strings, attempt to detect date formats
  else if (typeof value === "string") {
    // Check for common date patterns
    if (/^\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}$/.test(value)) {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("en-GB");
      }
    }
    return value;
  }

  // For Excel date serials (without breaking other numbers)
  else if (typeof value === "number") {
    // Excel date serials typically fall in specific ranges
    // 1 = January 1, 1900, modern dates are typically 40000-50000
    if (value > 35000 && value < 80000) {
      try {
        // Excel date calculation (adjust for Excel's 1900 leap year bug)
        const excelEpoch = new Date(1899, 11, 30);
        const possibleDate = new Date(
          excelEpoch.getTime() + value * 24 * 60 * 60 * 1000
        );

        // Final validation - make sure it's not too far in the future or past
        const currentYear = new Date().getFullYear();
        if (
          possibleDate.getFullYear() > 1920 &&
          possibleDate.getFullYear() < currentYear + 10
        ) {
          return possibleDate.toLocaleDateString("en-GB");
        }
      } catch (e) {
        // If conversion fails, treat as a regular number
      }
    }

    // Regular number formatting
    return Number.isInteger(value) ? value : Number(value.toFixed(2));
  }

  // Handle objects
  else if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
  }

  return value ?? ""; // Handle null/undefined as empty string
}
export function buildGroupedColumns(data: DataRow[]): ColumnDef<DataRow>[] {
  if (!data.length) return [];

  const sortedKeys = Object.keys(data[0]).sort();
  const columnsTree: any = {};

  sortedKeys.forEach((fullKey) => {
    const levels = fullKey.split(" | ");
    if (levels.length === 1) {
      // Simple column
      columnsTree[fullKey] = {
        accessorKey: fullKey,
        id: fullKey,
        header: fullKey,
        cell: (info: { getValue: () => any }) =>
          formatCellValue(info.getValue()),
      };
    } else {
      let current = columnsTree;

      // Walk through tree levels except last (it's leaf column)
      for (let i = 0; i < levels.length - 1; i++) {
        const level = levels[i];
        current[level] = current[level] || { children: {} };
        current = current[level].children;
      }

      const leaf = levels[levels.length - 1];
      // console.log(leaf);

      current[leaf] = {
        accessorKey: fullKey,
        id: fullKey,
        header: leaf,
        cell: (info: { getValue: () => any }) =>
          formatCellValue(info.getValue()),
      };
    }
  });

  function buildColumns(tree: any): ColumnDef<DataRow>[] {
    return Object.entries(tree).map(([key, value]: [string, any]) => {
      if (value.accessorKey) {
        return value;
      } else {
        return {
          header: key,
          columns: buildColumns(value.children),
        };
      }
    });
  }

  return buildColumns(columnsTree);
}

// export function buildGroupedRows(
//   data: DataRow[],
//   rowFields: string[],
//   level = 0
// ): any[] {
//   if (level >= rowFields.length) return data;

//   const grouped: Record<string, DataRow[]> = {};
//   const currentField = rowFields[level];

//   data.forEach((row) => {
//     const key: any = row[currentField] ?? "Unknown";
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(row);
//   });

//   return Object.entries(grouped).map(([key, rows]) => {
//     const childRows = buildGroupedRows(rows, rowFields, level + 1);
//     const sample = rows[0];

//     return {
//       id: rowFields
//         .slice(0, level + 1)
//         .map((f) => sample[f])
//         .join("|"),
//       [currentField]: key,
//       ...(!Array.isArray(childRows) ? {} : {}),
//       subRows: Array.isArray(childRows) ? childRows : [],
//     };
//   });
// }
