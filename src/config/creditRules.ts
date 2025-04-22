export interface CreditRules {
  [activity: string]: number;
}

export const rules: CreditRules = {
  upload: -1,
  pivot: -5,
  aggregation: -2,
};

export const initialCredit: number = 100;
