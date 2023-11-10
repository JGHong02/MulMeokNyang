export type CheckMessageAuthCodeFormType = {
  authCode: string;
  valid: {
    authCode: boolean;
  };
};

export const initialCheckMessageAuthCodeForm = {
  authCode: "",
  valid: {
    authCode: false,
  },
};
