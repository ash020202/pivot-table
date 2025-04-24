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
    <div className="absolute right-0 top-2 h-fit w-[100px] overflow-y-auto bg-white rounded z-20 shadow">
      {["SUM", "AVG", "COUNT"].map((type) => (
        <div key={type} className="flex justify-around w-full py-1">
          <input
            type="checkbox"
            checked={selectedAggs.includes(type)}
            onChange={() => onAggChange(field, type)}
          />
          <span>{type}</span>
        </div>
      ))}
    </div>
  );
};
