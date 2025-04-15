import { useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { buildGroupedColumns } from "../utils/pivotHelper";
import { DataRow, PivotTableProps } from "../utils/types";
import RowGroup from "./RowGroup";
import HeaderGroup from "./HeaderGroup";

export default function PivotTable({ data }: PivotTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // console.log(data[0]);

  // const columns: ColumnDef<DataRow>[] =
  //   data.length > 0
  //     ? [
  //         ...Object.keys(data[0]).map((col) => ({
  //           accessorKey: col,
  //           id: col,
  //           header: col,
  //           cell: (info: CellContext<DataRow, unknown>) =>
  //             formatCellValue(info.getValue()),
  //         })),
  //       ]
  //     : [];

  // const columns: ColumnDef<DataRow>[] =
  //   data.length > 0
  //     ? [
  //         ...Object.keys(data[0]).map((col) => ({
  //           accessorKey: col,
  //           id: col,
  //           header: () => {
  //             // Customize the header rendering logic to treat leaf and parent columns
  //             if (col.includes(" | ")) {
  //               return (
  //                 <>
  //                   <div className="parent-column">
  //                     {col.split(" | ")[0]} {/* Parent column */}
  //                   </div>
  //                   <div className="leaf-column">
  //                     {col.split(" | ")[1]} {/* Leaf column */}
  //                   </div>
  //                 </>
  //               );
  //             }
  //             return col; // For simple columns, return them as they are
  //           },
  //           cell: (info: CellContext<DataRow, unknown>) =>
  //             formatCellValue(info.getValue()),
  //         })),
  //       ]
  //     : [];

  const columns: ColumnDef<DataRow>[] = buildGroupedColumns(data);
  // console.log(columns);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 38,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  // console.log(virtualRows);

  return (
    <div
      ref={parentRef}
      className="max-h-[515px] max-w-[750px] overflow-auto border rounded shadow"
    >
      <div className="min-w-max">
        <div className="sticky top-0 z-10 w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <HeaderGroup headerGroup={headerGroup} key={headerGroup.id} />
          ))}
        </div>

        <div
          style={{
            height: `${totalSize}px`,
            position: "relative",
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            return <RowGroup virtualRow={virtualRow} row={row} key={row.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
