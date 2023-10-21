export type findEmailFormType = {
  userName: string;
  userPhoneNum: string;
  valid: {
    userName: boolean;
    userPhoneNum: boolean;
  };
};

export const initialFindEmailForm = {
  userName: "",
  userPhoneNum: "",
  valid: {
    userName: false,
    userPhoneNum: false,
  },
};
