import axios from "axios";

export const getUserProfile = async (email: string) => {
  try {
    const res = await axios.get("/getUserProfile", {
      params: {
        userEmail: email,
      },
    });
    const userProfilePhotoUrl = res.data.userProfilePhotoUrl;
    const userNickname = res.data.userNickname;
    const userIntroduction = res.data.userIntroduction;
    return { userProfilePhotoUrl, userNickname, userIntroduction };
  } catch (error) {
    throw error;
  }
};
