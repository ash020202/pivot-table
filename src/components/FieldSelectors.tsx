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
      <div className="flex items-end  gap-1">
        <svg
          height="20"
          width="20"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="none" height="256" width="256" />
          <rect height="56" opacity="0.2" rx="8" width="176" x="40" y="144" />
          <rect height="56" opacity="0.2" rx="8" width="176" x="40" y="56" />
          <rect
            fill="none"
            height="56"
            rx="8"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            width="176"
            x="40"
            y="144"
          />
          <rect
            fill="none"
            height="56"
            rx="8"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            width="176"
            x="40"
            y="56"
          />
        </svg>
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
        <svg
          height={20}
          width={20}
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="none" height="256" width="256" />
          <rect
            height="56"
            opacity="0.2"
            rx="8"
            transform="translate(212 44) rotate(90)"
            width="176"
            x="-4"
            y="100"
          />
          <rect
            height="56"
            opacity="0.2"
            rx="8"
            transform="translate(300 -44) rotate(90)"
            width="176"
            x="84"
            y="100"
          />
          <rect
            fill="none"
            height="56"
            rx="8"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            transform="translate(212 44) rotate(90)"
            width="176"
            x="-4"
            y="100"
          />
          <rect
            fill="none"
            height="56"
            rx="8"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            transform="translate(300 -44) rotate(90)"
            width="176"
            x="84"
            y="100"
          />
        </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4v2.414l6.586 5.586L6 17.586V20h12v-2h-9.172l6.586-6.586-6.586-6.586H18V4H6z" />
        </svg>
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
