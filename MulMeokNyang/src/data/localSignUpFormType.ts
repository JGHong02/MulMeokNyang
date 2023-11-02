export type LocalSignUpFormType = {
  userEmail: string;
  userPw: string;
  userPwConfirm: string;
  valid: {
    userEmail: boolean;
    userPw: boolean;
    userPwConfirm: boolean;
  };
};

export const initialLocalSignUpForm = {
  userEmail: "",
  userPw: "",
  userPwConfirm: "",
  valid: {
    userEmail: false,
    userPw: false,
    userPwConfirm: false,
  },
};
