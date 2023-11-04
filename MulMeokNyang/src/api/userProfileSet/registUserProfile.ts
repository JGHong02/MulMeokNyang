import axios from "axios";

export const registUserProfile = async (
  email: string,
  profilePhoto: string,
  nickname: string,
  introduction: string
) => {
  try {
    const res = await axios.post("/registUserProfile", {
      userEmail: email,
      userProfilePhoto: profilePhoto,
      userNickname: nickname,
      userIntroduction: introduction,
    });

    // 중복되는 닉네임인 경우
    if (res.hasOwnProperty("nicknameExists")) {
      const nicknameExists = res.data.nicknameExists;
      return { nicknameExists };
    }

    // 사용자 프로필 등록 성공
    const registDone = res.data.registDone;
    return { registDone };
  } catch (error) {
    throw error;
  }
};
