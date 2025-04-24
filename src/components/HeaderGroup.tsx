import { flexRender } from "@tanstack/react-table";
import { HeaderGroupProps } from "../utils/types";

const HeaderGroup = ({ headerGroup }: HeaderGroupProps) => {
  return (
    <div key={headerGroup.id} className="flex w-full bg-[#ddebf7] ">
      {headerGroup.headers.map((header) => {
        const isSorted = header.column.getIsSorted();

        return (
          <div
            key={header.id}
            className="text-[14px] flex border px-4 py-2 text-center font-bold relative cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap"
            onClick={header.column.getToggleSortingHandler()}
            style={{
              width: header.getSize(),
              minWidth: header.column.columnDef.minSize ?? 60,
              maxWidth: header.column.columnDef.maxSize ?? 1000,
              flexShrink: 0,
            }}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {isSorted === "asc" ? (
              " 🔼"
            ) : isSorted === "desc" ? (
              " 🔽"
            ) : (
              <p className="ml-2">⬍</p>
            )}
            {header.column.getCanResize() && (
              <div
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-gray-500"
                style={{ touchAction: "none" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HeaderGroup;
