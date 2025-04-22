import { useEffect, useRef, useState } from "react";
import { useCreditManager } from "../context/creditContext";
import CreditHistory from "./CreditHistory";

const CreditCard = () => {
  const { credits, history, needsRecharge } = useCreditManager();
  const [change, setChange] = useState<number | null>(null);
  const prevLengthRef = useRef<number>(history.length);

  const [openHistory, setOpenHistory] = useState<boolean>(false);
  useEffect(() => {
    if (history.length > prevLengthRef.current) {
      const last = history[history.length - 1];
      setChange(last.change);
      const timer = setTimeout(() => setChange(null), 1000);
      prevLengthRef.current = history.length; // update ref to new length

      return () => {
        clearTimeout(timer);
        prevLengthRef.current = 0;
      };
    }
  }, [history]);

  return (
    <div className=" py-2  absolute right-10 top-1">
      <div className="relative">
        <button
          onClick={() => setOpenHistory((prev) => !prev)}
          className="bg-black w-[250px] text-white p-4 rounded-lg text-[14px] cursor-pointer"
        >
          Available Credits:
          <span
            className={`font-bold pl-1 text-[18px] ${
              credits < 30 ? "text-red-500" : "text-green-300"
            }`}
          >
            {credits}
          </span>
        </button>

        {change !== null && (
          <span
            className={`absolute right-2 opacity-0  -translate-x-1/2 text-[25px] font-bold pointer-events-none ${
              change < 0 ? "text-red-400" : "text-green-400"
            }`}
            style={{
              animation: "fadeUp .8s ease-out",
              top: "-10px",
              position: "absolute",
              whiteSpace: "nowrap",
            }}
          >
            {change > 0 ? `+${change}` : change}
          </span>
        )}
        {needsRecharge && (
          <p className="text-red-500 mt-2 text-sm font-medium animate-pulse">
            ⚠️ Low Credits! Please recharge to continue.
          </p>
        )}
      </div>
      {openHistory && <CreditHistory />}
    </div>
  );
};

export default CreditCard;
