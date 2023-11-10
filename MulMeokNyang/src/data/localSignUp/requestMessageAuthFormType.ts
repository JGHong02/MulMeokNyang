export type RequestMessageAuthFormType = {
  userName: string;
  userPhoneNum: string;
  valid: {
    userName: boolean;
    userPhoneNum: boolean;
  };
};

export const initialRequestMessageAuthForm = {
  userName: "",
  userPhoneNum: "",
  valid: {
    userName: false,
    userPhoneNum: false,
  },
};
