import axios from "axios";

export const getUserProfile = async (email: string) => {
  try {
    const res = await axios.get("/getUserProfile", {
      params: {
        userEmail: email,
      },
    });
    const userProfilePhoto = res.data.userProfilePhoto;
    const userNickname = res.data.userNickname;
    const userIntroduction = res.data.userIntroduction;
    return { userProfilePhoto, userNickname, userIntroduction };
  } catch (error) {
    throw error;
  }
};
