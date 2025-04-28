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
