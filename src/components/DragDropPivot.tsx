import React, { useEffect, useState } from "react";
import { DragDropProps, Field } from "../utils/types";
import valuesIcon from "../assets/valuesIcon.svg";
import measureOptionIcon from "../assets/measureOptionIcon.svg";
import { MeasureOptions } from "./MeasureOptions";
import { useCreditManager } from "../context/creditContext";
import png from "../assets/reset_icon.png";
import FieldArea from "./FieldArea";
import closeIcon from "../assets/close_icon.svg";
export default function DragDropPivot({
  numericColumns,
  categoricalColumns,
  setRowFields,
  setColumnFields,
  setMeasureFields,
  rowFields,
  columnFields,
  measureField,
  measureAggregations,
  setMeasureAggregations,
}: DragDropProps) {
  const [openModal, setOpenModal] = useState<number | null>(null);
  const [_, setAggregation] = useState<string[]>(["SUM"]);
  const { resetCredits } = useCreditManager();
  const [fields, setFields] = useState<Field[]>([]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModal(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    // Check if click happened inside a MeasureOptions dropdown
    const target = e.target as HTMLElement;
    if (
      target.closest(".measure-options") ||
      target.closest(".open-agg-button")
    ) {
      // If clicked inside the aggregation options or button, do nothing
      return;
    }
    setOpenModal(null);
  };

  // Populate fields from props when component mounts
  useEffect(() => {
    const allFields: Field[] = [
      ...categoricalColumns.map((col) => ({
        id: col,
        label: col,
        isNumeric: false,
      })),
      ...numericColumns.map((col) => ({
        id: col,
        label: col,
        isNumeric: true,
      })),
    ];
    setFields(allFields);
  }, [numericColumns, categoricalColumns]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    field: Field,
    source: "rows" | "columns" | "measure" | "fields" // ADD SOURCE
  ) => {
    e.dataTransfer.setData("fieldId", field.id);
    e.dataTransfer.setData("source", source); // store source
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: "rows" | "columns" | "measure"
  ) => {
    e.preventDefault();
    const fieldId = e.dataTransfer.getData("fieldId");
    const source = e.dataTransfer.getData("source") as
      | "rows"
      | "columns"
      | "measure"
      | "fields";
    // console.log(source);

    let field: Field | undefined;
    if (source === "fields") {
      field = fields.find((f) => f.id === fieldId);
    } else if (source === "rows") {
      field = rowFields.find((f) => f.id === fieldId);
      setRowFields((prev) => prev.filter((f) => f.id !== fieldId));
    } else if (source === "columns") {
      field = columnFields.find((f) => f.id === fieldId);
      setColumnFields((prev) => prev.filter((f) => f.id !== fieldId));
    } else if (source === "measure") {
      field = measureField.find((f) => f.id === fieldId);
      setMeasureFields((prev) => prev.filter((f) => f.id !== fieldId));
    }

    if (!field) return;

    // if dragged from Row <-> Column
    const draggedFromFields = source === "rows" || source === "columns";

    if (target === "rows") {
      if (!field.isNumeric || draggedFromFields) {
        setRowFields((prev) => [...prev, field]);
      } else {
        alert("Measure field cannot be placed in rows");
        return;
      }
    } else if (target === "columns") {
      if (!field.isNumeric || draggedFromFields) {
        setColumnFields((prev) => [...prev, field]);
      } else {
        alert("Measure field cannot be placed in columns");
        return;
      }
    } else if (target === "measure") {
      if (field.isNumeric) {
        setMeasureFields((prev) => [...prev, field]);
      } else {
        alert("Only numeric fields allowed in Measures");
        return;
      }
    }

    if (source === "fields") {
      setFields((prev) => prev.filter((f) => f.id !== fieldId));
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const isFieldUsed = (field: Field) => {
    return (
      rowFields.some((r) => r.id === field.id) ||
      columnFields.some((c) => c.id === field.id) ||
      measureField.some((m) => m.id === field.id)
    );
  };

  const handleRemove = (
    field: Field,
    setArea: React.Dispatch<React.SetStateAction<Field[]>>
  ) => {
    setArea((prev) => prev.filter((item) => item.id !== field.id));
    setFields((prev) => [field, ...prev]);
    setOpenModal(null);
  };

  const openMeasureOption = (index: number) => {
    // console.log(index);

    setOpenModal(index);
  };
  const onAggChange = (field: string, type: string) => {
    setMeasureAggregations((prev) => {
      const currentAggs = prev[field] || [];
      if (currentAggs.includes(type)) {
        // Remove it
        return {
          ...prev,
          [field]: currentAggs.filter((agg) => agg !== type),
        };
      } else {
        // Add it
        return {
          ...prev,
          [field]: [...currentAggs, type],
        };
      }
    });
  };
  const resetFields = () => {
    // Reset all areas (row, column, measure)
    setRowFields([]);
    setColumnFields([]);
    setMeasureFields([]);
    setMeasureAggregations({});
    setAggregation(["SUM"]);

    // Repopulate the available fields
    const allFields: Field[] = [
      ...categoricalColumns.map((col) => ({
        id: col,
        label: col,
        isNumeric: false,
      })),
      ...numericColumns.map((col) => ({
        id: col,
        label: col,
        isNumeric: true,
      })),
    ];

    setFields(allFields);
    resetCredits();
  };

  return (
    <div className=" flex flex-col items-start select-none">
      <div className="flex max-h-[300px] text-[14px] ">
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="flex gap-4">
            {/* Row Area */}
            <FieldArea
              title="Row Area"
              fields={rowFields}
              onDrop={(e) => handleDrop(e, "rows")}
              onDragStart={(e, field) => handleDragStart(e, field, "rows")}
              onRemove={handleRemove}
              setArea={setRowFields}
              allowDrop={allowDrop}
            />

            {/* Column Area */}
            <FieldArea
              title="Column Area"
              fields={columnFields}
              onDrop={(e) => handleDrop(e, "columns")}
              onDragStart={(e, field) => handleDragStart(e, field, "columns")}
              onRemove={handleRemove}
              setArea={setColumnFields}
              allowDrop={allowDrop}
            />
          </div>

          <div
            onDrop={(e) => handleDrop(e, "measure")}
            onDragOver={allowDrop}
            className="min-h-[150px] w-full border-[2px] border-dashed border-green-400 rounded max-h-[50px] overflow-y-auto bg-white"
          >
            <h4 className="sticky top-0 z-5 bg-[#f0f0f0] py-1 px-2">
              Values Area
            </h4>
            <div className="py-1 px-4 ">
              {measureField.map((m, index) => (
                <div
                  className=" flex justify-between w-[200px] rounded p-2 mt-1 border bg-white"
                  key={m.id}
                  style={{ padding: "5px" }}
                >
                  <div className="flex gap-2 relative measure-options">
                    <p>{m.label}</p>

                    <button
                      className="open-agg-button"
                      onClick={() => openMeasureOption(index)}
                    >
                      <img
                        className="cursor-pointer"
                        src={measureOptionIcon}
                        height={15}
                        width={15}
                        alt=""
                      />
                    </button>
                    {openModal === index && (
                      <MeasureOptions
                        field={m.label}
                        selectedAggs={measureAggregations[m.id] || []}
                        onAggChange={onAggChange!}
                      />
                    )}
                  </div>

                  <img
                    onClick={() => handleRemove(m, setMeasureFields)}
                    src={closeIcon}
                    className="object-contain cursor-pointer"
                    height={15}
                    width={15}
                    alt=""
                  />
                </div>
              ))}
              {measureField.length == 0 && <div className="">No fields</div>}
            </div>
          </div>
        </div>
        {/* Available Fields */}
        <div className="h-[280px] w-[200px] overflow-y-auto">
          <h3 className="sticky top-0 p-2 bg-[#f0f0f0] z-5">Fields</h3>
          {fields.map((field) => {
            const disabled = isFieldUsed(field);
            return (
              <div
                key={field.id}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, field, "fields")}
                className={`rounded p-2 mt-1 border ${
                  disabled
                    ? "cursor-not-allowed bg-[#ccc] opacity-[0.6]"
                    : "cursor-grab bg-white "
                }`}
              >
                {field.isNumeric ? (
                  <div className="flex ">
                    <img src={valuesIcon} /> <p>{field.label}</p>
                  </div>
                ) : (
                  <p>{field.label}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={resetFields}
        className="ml-4 px-4 py-2 flex justify-center items-center gap-2 bg-green-700 text-white rounded-md hover:bg-red-600 cursor-pointer"
      >
        Reset
        <img className="h-[20px] w-[20px]" src={png} />
      </button>
    </div>
  );
}
