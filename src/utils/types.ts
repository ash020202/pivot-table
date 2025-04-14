import { Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";
import { HeaderGroup as TanStackHeaderGroup } from "@tanstack/react-table";
// A single row from the uploaded file
export type DataRow = Record<string, string | number | Date | null | undefined>;

export type FieldSelectorsProps = {
  numericColumns: string[];
  rowFields: string[];
  setRowFields: (fields: string[]) => void;
  columnFields: string[];
  setColumnFields: (fields: string[]) => void;
  measureFields: string[];
  setMeasureFields: (fields: string[]) => void;
  rowAndColOptions: string[];
  aggregation: string;
  setAggregation: (agg: string) => void;
};
// Aggregation types
export type AggregationType = "SUM" | "AVG" | "COUNT";

export type PivotTableProps = {
  data: DataRow[];
};

export type PivotFunctionProps = {
  rawData: DataRow[];
  rowFields: string[];
  columnFields: string[];
  measureFields: string[];
  aggregation: string;
};

export interface RowGroupProps {
  row: Row<DataRow>;
  virtualRow: VirtualItem;
}

export interface HeaderGroupProps {
  headerGroup: TanStackHeaderGroup<DataRow>;
}

// Option type used in dropdowns
// Option type used in dropdowns
export type Option = {
  label: string;
  value: string;
};

export type ReusableSelectProps = {
  value: string | string[]; // Single or multi-select value
  onChange: (value: string | string[]) => void;
  options: Array<string | Option>;
  placeholder?: string;
  disabledOptions?: Array<string | Option>;
  isMulti?: boolean;
};
