export type CatProfileFormType = {
  catProfilePhotoUrl: string;
  catName: string;
  catAge: string;
  catWeight: string;
  valid: {
    catName: boolean;
    catAge: boolean;
    catWeight: boolean;
  };
};

export const initialCatProfileForm = {
  catProfilePhotoUrl: "",
  catName: "",
  catAge: "",
  catWeight: "",
  valid: {
    catName: false,
    catAge: false,
    catWeight: false,
  },
};
