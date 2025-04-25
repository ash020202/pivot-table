import { FieldSelectorsProps } from "../utils/types";
import ReusableSelect from "./ReusableSelect";
import rowIcon from "../assets/rows.svg";
import valuesIcon from "../assets/valuesIcon.svg";
import columnsIcon from "../assets/columns_icon.svg";
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
      <div className="flex items-end  gap-1">
        <img src={rowIcon} />
        <p className="font-semibold">Rows</p>
      </div>
      <ReusableSelect
        isMulti
        value={rowFields}
        onChange={handleRowFieldsChange}
        options={rowAndColOptions}
        disabledOptions={columnFields}
        placeholder="-- Select Row Field(s) --"
      />
      <div className="flex items-center  gap-1">
        <img height={20} width={20} src={columnsIcon} />
        <p className="font-semibold">Columns</p>
      </div>
      <ReusableSelect
        isMulti
        value={columnFields}
        onChange={handleColumnFieldsChange}
        options={rowAndColOptions}
        disabledOptions={rowFields}
        placeholder="-- Select Column Field(s) --"
      />

      <div className="flex items-center  gap-2">
        <img src={valuesIcon} alt="" />
        <p className="font-semibold">Values</p>
      </div>
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
