export type FindPwFormType = {
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
