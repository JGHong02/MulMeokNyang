export type FindPwFormType = {
  userEmail: string;
  userPhoneNum: string;
  valid: {
    userEmail: boolean;
    userPhoneNum: boolean;
  };
};

export const initialFindPwForm = {
  userEmail: "",
  userPhoneNum: "",
  valid: {
    userEmail: false,
    userPhoneNum: false,
  },
};
