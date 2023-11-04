import axios from "axios";

export const modifyUserProfile = async (
  email: string,
  profilePhoto: string,
  nickname: string,
  introduction: string
) => {
  try {
    const res = await axios.put("/modifyUserProfile", {
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

    // 사용자 프로필 수정 성공
    const modifyDone = res.data.modifyDone;
    return { modifyDone };
  } catch (error) {
    throw error;
  }
};
