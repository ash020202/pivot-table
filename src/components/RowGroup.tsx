import { flexRender } from "@tanstack/react-table";
import { RowGroupProps } from "../utils/types";

const RowGroup = ({ row, virtualRow }: RowGroupProps) => {
  return (
    <div
      key={row.id}
      className="flex w-full hover:bg-gray-50 text-[14px]"
      style={{
        position: "absolute",
        top: 0,
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <div
          key={cell.id}
          className="border px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            width: cell.column.getSize(),
            minWidth: cell.column.columnDef.minSize ?? "auto",
            maxWidth: cell.column.columnDef.maxSize ?? "none",
            flexShrink: 0,
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  );
};

export default RowGroup;
