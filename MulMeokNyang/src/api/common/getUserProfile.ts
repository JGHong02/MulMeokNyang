import axios from "axios";

export const getUserProfile = async (email: string) => {
  console.log("-----getUserProfile API 호출 중-----");
  console.log("email :", email);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getUserProfile",
      {
        params: {
          userEmail: email,
        },
      }
    );
    const userProfilePhoto = res.data.userProfilePhoto;
    const userNickname = res.data.userNickname;
    const userIntroduction = res.data.userIntroduction;
    console.log("userProfilePhoto :", userProfilePhoto);
    console.log("userNickname :", userNickname);
    console.log("userIntroduction :", userIntroduction);

    return { userProfilePhoto, userNickname, userIntroduction };
  } catch (error: any) {
    console.log("getUserProfile API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
