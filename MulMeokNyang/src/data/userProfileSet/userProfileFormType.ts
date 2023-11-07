export type UserProfileFormType = {
  userProfilePhotoUrl: string;
  userNickname: string;
  userIntroduction: string;
  valid: {
    userNickname: boolean;
  };
};

export const initialUserProfileForm = {
  userProfilePhotoUrl: "",
  userNickname: "",
  userIntroduction: "",
  valid: {
    userNickname: false,
  },
};
