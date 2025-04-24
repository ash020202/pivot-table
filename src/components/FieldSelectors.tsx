import { FieldSelectorsProps } from "../utils/types";
import ReusableSelect from "./ReusableSelect";

export default function FieldSelectors({
  numericColumns,
  rowFields,
  setRowFields,
  columnFields,
  setColumnFields,
  measureFields,
  setMeasureFields,
  rowAndColOptions,
  measureAggregations, // Add this prop
  setMeasureAggregations, // Add this prop
}: FieldSelectorsProps) {
  const handleRowFieldsChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setRowFields(value);
    }
  };

  const handleColumnFieldsChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setColumnFields(value);
    }
  };

  const handleMeasureFieldsChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setMeasureFields(value);
    }
  };

  const handleAggregationChangeForMeasure = (field: string, type: string) => {
    setMeasureAggregations((prev) => {
      const current = prev[field] || [];
      if (current.includes(type)) {
        return { ...prev, [field]: current.filter((t) => t !== type) }; // Uncheck
      } else {
        return { ...prev, [field]: [...current, type] }; // Check
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-4 p-1 ">
      <p className="font-semibold">Row Fields Multi-Select</p>
      <ReusableSelect
        isMulti
        value={rowFields}
        onChange={handleRowFieldsChange}
        options={rowAndColOptions}
        disabledOptions={columnFields}
        placeholder="-- Select Row Field(s) --"
      />

      <p className="font-semibold">Column Fields</p>
      <ReusableSelect
        isMulti
        value={columnFields}
        onChange={handleColumnFieldsChange}
        options={rowAndColOptions}
        disabledOptions={rowFields}
        placeholder="-- Select Column Field(s) --"
      />

      <p className="font-semibold">Measure Fields</p>
      <ReusableSelect
        isMulti
        isMeasureCol
        value={measureFields}
        onChange={handleMeasureFieldsChange}
        options={numericColumns}
        placeholder="-- Select Measure Field(s) --"
        measureAggregations={measureAggregations}
        onAggChange={handleAggregationChangeForMeasure}
      />
    </div>
  );
}
