export type CatFeedStuffSetFormType = {
  isEatingFeedStuff: boolean;
  catFeedStuffDailyConsumption: string;
  catFeedStuffMoistureContent: string;
  valid: {
    catFeedStuffDailyConsumption: boolean;
    catFeedStuffMoistureContent: boolean;
  };
};

export const initialCatFeedStuffSetForm = {
  isEatingFeedStuff: true,
  catFeedStuffDailyConsumption: "",
  catFeedStuffMoistureContent: "70",
  valid: {
    catFeedStuffDailyConsumption: false,
    catFeedStuffMoistureContent: true,
  },
};
