export type UserProfileFormType = {
  userProfilePhoto: string;
  userNickname: string;
  userIntroduction: string;
  valid: {
    userNickname: boolean;
  };
};

export const initialUserProfileForm = {
  userProfilePhoto:
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540chansolchoi%252Fmulmeoknyang/ImagePicker/0ed8bd00-0719-4cdd-85b2-03e0f27a46d4.jpeg",
  userNickname: "",
  userIntroduction: "",
  valid: {
    userNickname: false,
  },
};
