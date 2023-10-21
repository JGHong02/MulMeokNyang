export type loginFormType = {
  userEmail: string;
  userPw: string;
  valid: {
    userEmail: boolean;
    userPw: boolean;
  };
};

export const initialLoginForm = {
  userEmail: "",
  userPw: "",
  valid: {
    userEmail: false,
    userPw: false,
  },
};
