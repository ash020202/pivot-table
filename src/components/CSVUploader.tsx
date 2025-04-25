import React, { useMemo, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { generatePivotData } from "../utils/pivotHelper";
import PivotTable from "./PivotTable";
import FieldSelectors from "./FieldSelectors";
import { DataRow } from "../utils/types";
import { useCreditManager } from "../context/creditContext";
import FileIcons from "./ui/FileIcons";
import png from "../assets/reset_icon.png";
const CSVUploader = () => {
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [rowFields, setRowFields] = useState<string[]>([]);
  const [columnFields, setColumnFields] = useState<string[]>([]);
  const [measureFields, setMeasureFields] = useState<string[]>([]);
  const [measureAggregations, setMeasureAggregations] = useState<
    Record<string, string[]>
  >({});

  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [categoricalColumns, setCategoricalColumns] = useState<string[]>([]);
  const [aggregation, setAggregation] = useState<string[]>(["SUM"]);
  const [fileName, setFileName] = useState("No file Uploaded");
  const { handleActivity, resetCredits } = useCreditManager();

  // Effect to sync measureAggregations with the main component state
  useEffect(() => {
    const newMeasureAggs: Record<string, string[]> = {};
    measureFields.forEach((field) => {
      // If we have existing aggregations for this field, use them
      // Otherwise default to the global aggregation setting
      newMeasureAggs[field] = measureAggregations[field] || [...aggregation];
    });
    setMeasureAggregations(newMeasureAggs);
  }, [measureFields]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleActivity("upload");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file) {
      setFileName(file.name);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(fileData, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (jsonData.length > 0) {
        const allCols = Object.keys(jsonData[0]);

        const numericCols = allCols.filter((col) =>
          jsonData.every((row) =>
            row[col] === "" || row[col] === null || row[col] === undefined
              ? true
              : !isNaN(parseFloat(String(row[col])))
          )
        );

        const categoricalCol = allCols.filter(
          (col) => !numericCols.includes(col)
        );

        setNumericColumns(numericCols);
        setCategoricalColumns(categoricalCol);
        setRawData(jsonData);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const resetFields = () => {
    resetCredits();
    setRowFields([]);
    setColumnFields([]);
    setMeasureFields([]);
    setMeasureAggregations({});
    setAggregation(["SUM"]);
  };

  const groupedPivotData = useMemo(() => {
    return generatePivotData({
      rawData,
      rowFields,
      columnFields,
      measureFields,
      aggregation,
      measureAggregations,
    });
  }, [
    rawData,
    rowFields,
    columnFields,
    measureFields,
    aggregation,
    measureAggregations,
  ]);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-2">
        CSV / Excel Viewer + Pivot Table
      </h2>

      <label className="flex flex-col items-center justify-center px-6 py-4 bg-white text-green-500 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-300">
        {/* <span className="text-3xl mb-2">📁</span> */}
        <FileIcons />
        {/* <span className="text-sm font-medium">Upload CSV/Excel</span> */}
        <input
          type="file"
          accept=".csv, .xls, .xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      <p className="pt-4 text-[18px] font-semibold">
        Uploaded File name: <span className="text-green-500">{fileName}</span>
      </p>

      <div className="flex pt-5">
        <PivotTable data={groupedPivotData} />

        {rawData.length > 0 && (
          <div className="flex flex-col h-[525px] items-center gap-2 p-5 ">
            <div className="h-[510px] w-full overflow-y-auto">
              <div className="sticky top-0 bg-[#f0f0f0] z-2 pb-2">
                <p className="p-1 text-lg font-semibold">Pivot Table Fields</p>
                <p className="p-1 text-sm ">Choose Fields To Add To Report</p>
              </div>

              <FieldSelectors
                numericColumns={numericColumns}
                rowFields={rowFields}
                setRowFields={setRowFields}
                columnFields={columnFields}
                setColumnFields={setColumnFields}
                measureFields={measureFields}
                setMeasureFields={setMeasureFields}
                rowAndColOptions={categoricalColumns}
                aggregation={aggregation}
                setAggregation={setAggregation}
                measureAggregations={measureAggregations}
                setMeasureAggregations={setMeasureAggregations}
              />
            </div>
            <button
              onClick={resetFields}
              className="px-4 py-2 flex justify-center items-center gap-2 bg-green-700 text-white rounded-md hover:bg-red-600 cursor-pointer"
            >
              Reset
              <img className="h-[20px] w-[20px]" src={png} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVUploader;
