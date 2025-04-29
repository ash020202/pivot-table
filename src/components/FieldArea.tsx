import React from "react";
import { Field } from "../utils/types";
import closeIcon from "../assets/close_icon.svg";
type FieldAreaProps = {
  title: string;
  fields: Field[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, field: Field) => void;
  onRemove: (
    field: Field,
    setArea: React.Dispatch<React.SetStateAction<Field[]>>
  ) => void;
  setArea: React.Dispatch<React.SetStateAction<Field[]>>; // ADD this
  allowDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

const FieldArea = ({
  title,
  fields,
  onDrop,
  onDragStart,
  onRemove,
  setArea,
  allowDrop,
}: FieldAreaProps) => (
  <div
    className="min-h-[100px] max-h-[100px] w-[150px] border-[2px] border-gray-400 rounded overflow-y-auto bg-white"
    onDrop={onDrop}
    onDragOver={allowDrop}
  >
    <h4 className="sticky top-0 z-5 bg-[#f0f0f0] py-1 px-2 font-semibold">
      {title}
    </h4>
    <div className="p-2 bg-white    ">
      {fields.map((field) => (
        <div
          draggable
          onDragStart={(e) => onDragStart(e, field)}
          key={field.id}
          className="flex h-full justify-between rounded p-2 mt-1 border "
        >
          <p>{field.label}</p>
          {/* <span className="absolute right-2">X</span> */}
          <img
            onClick={() => onRemove(field, setArea)}
            src={closeIcon}
            className="object-contain cursor-pointer"
            height={15}
            width={15}
            alt=""
          />
        </div>
      ))}
      {fields.length == 0 && <div className="">No fields</div>}
    </div>
  </div>
);

export default FieldArea;
