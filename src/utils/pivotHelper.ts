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
  // console.log("result", result);

  return result;
}

export function formatCellValue(value: any): string | number {
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB");
  } else if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(2);
  }
  return value;
}
