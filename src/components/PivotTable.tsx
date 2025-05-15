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

export default function PivotTable({ data, showRightPanel }: PivotTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

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
    estimateSize: () => 35,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  // console.log(virtualRows);

  return (
    <div
      ref={parentRef}
      className={`${
        showRightPanel ? "max-w-full" : "  max-w-[750px]"
      } max-h-[350px] overflow-auto border rounded shadow`}
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
