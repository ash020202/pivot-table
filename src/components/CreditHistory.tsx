import { useCreditManager } from "../context/creditContext";

const CreditHistory = () => {
  const { history } = useCreditManager();
  if (history.length === 0)
    return (
      <p className="text-sm bg-white p-2  border rounded-lg  shadow">
        No credit history yet.
      </p>
    );

  return (
    <div className="transition-all h-[95px] overflow-y-auto mt-4 border rounded-lg  shadow bg-white z-10">
      <h3 className="font-semibold sticky top-0 bg-white p-2">
        Credit History
      </h3>
      <ul className="text-sm space-y-1 px-3 pb-2">
        {history.map((entry, index) => (
          <li key={index} className="flex justify-between">
            <span>{entry.activity}</span>
            <span
              className={entry.change > 0 ? "text-green-600" : "text-red-600"}
            >
              {entry.change > 0 ? "+" : ""}
              {entry.change}
            </span>
            <span className="text-gray-500">
              {new Date(entry.time).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreditHistory;
