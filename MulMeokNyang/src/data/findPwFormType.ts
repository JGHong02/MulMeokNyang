export type findPwFormType = {
  userEmail: string;
  valid: {
    userEmail: boolean;
  };
};

export const initialFindPwForm = {
  userEmail: "",
  valid: {
    userEmail: false,
  },
};
