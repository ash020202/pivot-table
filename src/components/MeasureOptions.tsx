export const MeasureOptions = ({
  field,
  selectedAggs = [],
  onAggChange = () => {},
}: {
  field: string;
  selectedAggs: string[];
  onAggChange: (field: string, type: string) => void;
}) => {
  return (
    <div className="absolute left-20 top-2 h-fit w-[100px] overflow-y-auto bg-white rounded z-2 shadow-lg">
      {["SUM", "AVG", "CNT"].map((type) => (
        <label
          key={type}
          className="flex justify-around w-full py-1 text-[12px] cursor-pointer"
          htmlFor={type}
        >
          <input
            name="aggregation"
            id={type}
            type="checkbox"
            checked={selectedAggs.includes(type)}
            onChange={() => onAggChange(field, type)}
          />
          <span>{type}</span>
        </label>
      ))}
    </div>
  );
};
