import { flexRender } from "@tanstack/react-table";
import { HeaderGroupProps } from "../utils/types";

const HeaderGroup = ({ headerGroup }: HeaderGroupProps) => {
  return (
    <div key={headerGroup.id} className="flex w-full bg-[#ddebf7] ">
      {headerGroup.headers.map((header) => {
        const isSorted = header.column.getIsSorted();
        const isLeaf = !header.subHeaders || header.subHeaders.length === 0;

        return (
          <div
            key={header.id}
            className="text-[14px] border relative px-4 py-2 flex justify-center items-center gap-2"
            onClick={header.column.getToggleSortingHandler()}
            style={{
              width: header.getSize(),
              minWidth: header.column.columnDef.minSize ?? 60,
              maxWidth: header.column.columnDef.maxSize ?? 1000,
              flexShrink: 0,
            }}
          >
            <div className=" flex items-center justify-center gap-2 cursor-pointer select-none overflow-hidden  hover:transition-all hover:overflow-visible hover:bg-[#ddebf7] hover:">
              <p className="text-center font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </p>
              {isLeaf &&
                (isSorted === "asc" ? (
                  <svg
                    height="15"
                    viewBox="0 0 320 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z" />
                  </svg>
                ) : isSorted === "desc" ? (
                  <svg
                    height="15"
                    viewBox="0 0 320 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M311.9 335.1l-132.4 136.8C174.1 477.3 167.1 480 160 480c-7.055 0-14.12-2.702-19.47-8.109l-132.4-136.8C-9.229 317.8 3.055 288 27.66 288h264.7C316.9 288 329.2 317.8 311.9 335.1z" />
                  </svg>
                ) : (
                  <svg
                    height="15"
                    viewBox="0 0 320 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                  </svg>
                ))}
            </div>

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
