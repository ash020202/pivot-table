import React, { createContext, useContext, useMemo, useState } from "react";
import { rules, initialCredit } from "../config/creditRules";

const CREDIT_KEY = "user_credits";
const HISTORY_KEY = "credit_history";

export interface HistoryEntry {
  activity: string;
  change: number;
  time: string;
}

interface CreditContextType {
  credits: number;
  history: HistoryEntry[];
  handleActivity: (activity: string) => void;
  resetCredits: () => void;
  needsRecharge: boolean;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState<number>(() => {
    const stored = localStorage.getItem(CREDIT_KEY);
    return stored ? JSON.parse(stored) : initialCredit;
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const handleActivity = (activity: string) => {
    const change = rules[activity] || 0;
    const updatedCredit = credits + change;
    if (updatedCredit < 0) {
      alert("❌ Not enough credits! Please recharge.");
      return;
    }
    const newEntry: HistoryEntry = {
      activity,
      change,
      time: new Date().toISOString(),
    };

    setCredits(updatedCredit);
    setHistory((prev) => [...prev, newEntry]);

    localStorage.setItem(CREDIT_KEY, JSON.stringify(updatedCredit));
    localStorage.setItem(HISTORY_KEY, JSON.stringify([...history, newEntry]));
  };

  const needsRecharge = useMemo(() => {
    const maxDeduction = Math.abs(Math.min(...Object.values(rules)));
    return credits < maxDeduction;
  }, [credits, rules]);

  const resetCredits = () => {
    setCredits(initialCredit);
    setHistory([]);
    localStorage.removeItem(CREDIT_KEY);
    localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <CreditContext.Provider
      value={{ credits, history, handleActivity, resetCredits, needsRecharge }}
    >
      {children}
    </CreditContext.Provider>
  );
};

export const useCreditManager = () => {
  const context = useContext(CreditContext);
  if (!context)
    throw new Error("useCreditManager must be used within CreditProvider");
  return context;
};
