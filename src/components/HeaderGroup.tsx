import { flexRender } from "@tanstack/react-table";
import { HeaderGroupProps } from "../utils/types";
import sortUpArrow from "../assets/sortUpArrow.svg";
import sortDownArrow from "../assets/sortDownArrow.svg";
import initialSortIcon from "../assets/initialSortIcon.svg";
const HeaderGroup = ({ headerGroup }: HeaderGroupProps) => {
  const handleChangeType = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      // Right-click detected
      e.preventDefault(); // This prevents the context menu from showing
      console.log("Right-click blocked via onMouseDown");
    }
  };
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  return (
    <div key={headerGroup.id} className="flex w-full bg-[#ddebf7] ">
      {headerGroup.headers.map((header) => {
        const isSorted = header.column.getIsSorted();
        const isLeaf = !header.subHeaders || header.subHeaders.length === 0;

        return (
          <div
            key={header.id}
            className="text-[12px] border relative px-4 py-2 flex justify-center items-center gap-2"
            onClick={header.column.getToggleSortingHandler()}
            onContextMenu={handleContextMenu}
            onMouseDown={handleChangeType}
            style={{
              width: header.getSize(),
              minWidth: header.column.columnDef.minSize ?? 60,
              maxWidth: header.column.columnDef.maxSize ?? 1000,
              flexShrink: 0,
            }}
          >
            <div className=" flex items-center justify-center gap-2 cursor-pointer select-none overflow-hidden  hover:transition-all hover:overflow-visible hover:bg-[#ddebf7] hover:">
              <p className="text-center font-bold overflow-hidden text-ellipsis hover:overflow-visible whitespace-nowrap">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </p>
              {isLeaf &&
                (isSorted === "asc" ? (
                  <img height={15} src={sortUpArrow} alt="" />
                ) : isSorted === "desc" ? (
                  <img height={15} src={sortDownArrow} alt="" />
                ) : (
                  <img height={15} src={initialSortIcon} alt="" />
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
