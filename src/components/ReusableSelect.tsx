import React from "react";
import { ReusableSelectProps } from "../utils/types";
import { useCreditManager } from "../context/creditContext";

const ReusableSelect = ({
  value,
  onChange,
  options,
  placeholder = "-- Select an option --",
  disabledOptions = [],
  isMulti = false,
}: ReusableSelectProps) => {
  // Convert string array options to Option objects
  const { handleActivity } = useCreditManager();
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
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        // Remove the option if it's already selected
        console.log(optionValue);
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        // Add the option if it's not selected
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
    return disabledValues.includes(optionValue);
  };

  if (isMulti) {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <div className="border rounded px-3 py-2 max-h-35 overflow-y-auto">
        {optionObjects.length === 0 ? (
          <p className="text-gray-400">No options available</p>
        ) : (
          optionObjects.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 py-1 ${
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
