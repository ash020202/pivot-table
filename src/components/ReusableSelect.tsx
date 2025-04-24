import React, { useEffect, useState } from "react";
import { ReusableSelectProps } from "../utils/types";
import { useCreditManager } from "../context/creditContext";
import { MeasureOptions } from "./MeasureOptions";

const ReusableSelect = ({
  value,
  onChange,
  options,
  placeholder = "-- Select an option --",
  disabledOptions = [],
  isMulti = false,
  isMeasureCol = false,
  measureAggregations,
  onAggChange,
}: ReusableSelectProps) => {
  // Convert string array options to Option objects
  const { handleActivity } = useCreditManager();
  const [openModal, setOpenModal] = useState<number | null>(null);
  const optionObjects = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  // Convert disabledOptions to Option objects if they're strings
  const disabledOptionObjects = disabledOptions.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  // Get array of disabled values
  const disabledValues = disabledOptionObjects.map((opt) => opt.value);

  const handleCheckboxChange = (optionValue: string) => {
    if (isOptionDisabled(optionValue)) return; // ⛔ Skip disabled options
    setOpenModal(null);

    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
        handleActivity("pivot");
      }
    }
  };

  const handleSingleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleActivity("aggregation");
    onChange(e.target.value);
  };

  const isOptionDisabled = (optionValue: string): boolean => {
    // console.log(optionValue);

    return disabledValues.includes(optionValue);
  };

  const openMeasureOption = (index: number) => {
    console.log(index);

    setOpenModal(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModal(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isMulti) {
    const selectedValues = Array.isArray(value) ? value : [];
    // console.log(selectedValues);
    console.log(measureAggregations);

    return (
      <div className="border rounded px-3 py-2 max-h-35 overflow-y-auto">
        {optionObjects.length === 0 ? (
          <p className="text-gray-400">No options available</p>
        ) : (
          optionObjects.map((option, index) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 py-1 relative ${
                isOptionDisabled(option.value)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                disabled={isOptionDisabled(option.value)}
              />
              <span>{option.label}</span>
              {isMeasureCol && (
                <>
                  <button
                    className={`bg-white py-0 px-1 rounded ${
                      !selectedValues.includes(option.value)
                        ? " cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => openMeasureOption(index)}
                    disabled={!selectedValues.includes(option.value)}
                  >
                    ...
                  </button>
                  {openModal === index && (
                    <MeasureOptions
                      field={option.value}
                      selectedAggs={measureAggregations?.[option.value] || []}
                      onAggChange={onAggChange!}
                    />
                  )}
                </>
              )}
            </label>
          ))
        )}
      </div>
    );
  }

  return (
    <select
      value={typeof value === "string" ? value : ""}
      onChange={handleSingleChange}
      className="border px-3 py-1 rounded"
    >
      <option value="">{placeholder}</option>
      {optionObjects.length === 0 ? (
        <option disabled>No options available</option>
      ) : (
        optionObjects.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={isOptionDisabled(option.value)}
          >
            {option.label}
          </option>
        ))
      )}
    </select>
  );
};

export default ReusableSelect;
