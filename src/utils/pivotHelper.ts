import { ColumnDef } from "@tanstack/react-table";
import { DataRow, PivotFunctionProps } from "./types";

export function generatePivotData({
  rawData,
  rowFields = [],
  columnFields = [],
  measureFields = [],
  aggregation = "SUM",
}: PivotFunctionProps): DataRow[] {
  if (!rowFields.length && !columnFields.length && !measureFields.length) {
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
      // const prev = rowObj[finalColKey] || 0;
      rowObj[finalColKey] = prev + 1;

      allColumnKeys.add(finalColKey);
      resultMap.set(rowKey, rowObj);
      return;
    }

    // If measures exist, aggregate
    measureFields.forEach((measure) => {
      const finalColKey = colKey
        ? `${colKey} | ${aggregation} of ${measure}`
        : `${aggregation} of ${measure}`;
      const value = Number(row[measure]) || 0;

      if (!grouped[rowKey]) grouped[rowKey] = {};
      if (!grouped[rowKey][finalColKey]) {
        grouped[rowKey][finalColKey] = [];
      }
      grouped[rowKey][finalColKey].push(value);
      allColumnKeys.add(finalColKey);

      resultMap.set(rowKey, rowObj); // save row
    });
  });

  const result: DataRow[] = [];

  for (const [rowKey, rowObj] of resultMap.entries()) {
    const values = grouped[rowKey];

    if (values) {
      Object.entries(values).forEach(([colKey, valArray]) => {
        let agg = 0;
        switch (aggregation) {
          case "SUM":
            agg = valArray.reduce((a, b) => a + b, 0);
            break;
          case "AVG":
            agg = valArray.reduce((a, b) => a + b, 0) / valArray.length;
            break;
          case "COUNT":
            agg = valArray.length;
            break;
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
  }
  // console.log("resultmap", resultMap);

  return result;
}

// export function formatCellValue(value: any): string | number {
//   if (value instanceof Date) {
//     return value.toLocaleDateString("en-GB");
//   } else if (typeof value === "number") {
//     return Number.isInteger(value) ? value : value.toFixed(2);
//   }
//   return value;
// }
export function formatCellValue(value: any): string | number {
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB");
  } else if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(2);
  } else if (typeof value === "object" && value !== null) {
    // Convert object to a readable string
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
  }

  return value ?? ""; // Handle null/undefined as empty string
}

export function buildGroupedColumns(data: DataRow[]): ColumnDef<DataRow>[] {
  if (!data.length) return [];

  const columnMap: Record<string, ColumnDef<DataRow>[]> = {};
  const simpleColumns: ColumnDef<DataRow>[] = [];

  Object.keys(data[0]).forEach((key) => {
    if (key.includes(" | ")) {
      const [parent, child] = key.split(" | ");
      if (!columnMap[parent]) columnMap[parent] = [];
      columnMap[parent].push({
        accessorKey: key,
        id: key,
        header: child,
        cell: (info) => formatCellValue(info.getValue()),
      });
    } else {
      simpleColumns.push({
        accessorKey: key,
        id: key,
        header: key,
        cell: (info) => formatCellValue(info.getValue()),
      });
    }
  });

  // Combine simple columns + grouped columns
  return [
    ...simpleColumns,
    ...Object.entries(columnMap).map(([parent, children]) => ({
      header: parent,
      columns: children,
    })),
  ];
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
