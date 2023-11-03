import axios from "axios";

export const quickSignUp = async (method: string) => {
  try {
    const res = await axios.post(`/quickSignUp/${method}`);
    const userEmail = res.data.userEmail;
    // Case 1. 간편 로그인 (이미 quickSignUp으로 회원가입한 사용자)
    if (res.data.hasOwnProperty("loginSuccess")) {
      const userNickname = res.data.userNickname;
      const managementSpaceId = res.data.managementSpaceId;
      return { userEmail, userNickname, managementSpaceId };
    }

    // Case 2. 간편 회원가입
    const registSuccess = res.data.registSuccess;
    return { registSuccess, userEmail };
  } catch (error) {
    throw error;
  }
};
