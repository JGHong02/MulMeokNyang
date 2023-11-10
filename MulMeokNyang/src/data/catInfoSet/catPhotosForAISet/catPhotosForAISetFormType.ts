export type CatPhotosForAISetFormType = {
  catPhotosUrlForAI: string[];
  valid: {
    catPhotosUrlForAI: boolean;
  };
};

export const initialCatPhotosForAISetForm = {
  catPhotosUrlForAI: ["", "", "", "", ""],
  valid: {
    catPhotosUrlForAI: false,
  },
};
