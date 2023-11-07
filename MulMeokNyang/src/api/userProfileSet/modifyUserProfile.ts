import axios from "axios";

export const modifyUserProfile = async (
  email: string,
  profilePhotoUrl: string,
  nickname: string,
  introduction: string
) => {
  try {
    const res = await axios.put("/modifyUserProfile", {
      userEmail: email,
      userProfilePhotoUrl: profilePhotoUrl,
      userNickname: nickname,
      userIntroduction: introduction,
    });

    // 중복되는 닉네임인 경우
    if (res.hasOwnProperty("nicknameExists")) {
      const nicknameExists = res.data.nicknameExists;
      return { nicknameExists };
    }

    // 사용자 프로필 수정 성공
    const modifySuccess = res.data.modifySuccess;
    return { modifySuccess };
  } catch (error) {
    throw error;
  }
};
