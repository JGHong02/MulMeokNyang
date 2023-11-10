export type CatHydrationSetFormType = {
  isHydrationAuto: boolean;
  catGoalHydration: string;
  valid: {
    catGoalHydration: boolean;
  };
};

export const initialCatHydrationSetForm = {
  isHydrationAuto: true,
  catGoalHydration: "",
  valid: {
    catGoalHydration: false,
  },
};
