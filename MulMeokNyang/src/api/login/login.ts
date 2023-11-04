import axios from "axios";

export const login = async (email: string, pw: string, checked: boolean) => {
  try {
    const res = await axios.post("/login", {
      userEmail: email,
      userPw: pw,
      autoLogin: checked,
    });

    // Case 1. 등록되지 않은 사용자 (이 경우에만 res에 userExists 속성이 있음)
    if (res.data.hasOwnProperty("userExists")) {
      const userExists = res.data.userExists;
      return { userExists };
    }

    const userEmail = res.data.userEmail;
    const userNickname = res.data.userNickname;
    const managementSpaceId = res.data.managementSpaceId;
    // Case 2. 자동 로그인 체크한 사용자
    if (res.data.hasOwnProperty("sessionID")) {
      // userNickname이 없는 사용자 프로필 등록을 마치지 않은 사용자의 경우
      // sessionID에 null이 담겨 있음
      const sessionID = res.data.sessionID;
      return { userEmail, userNickname, managementSpaceId, sessionID };
    }

    // Case 3. 자동 로그인 체크하지 않은 사용자
    return { userEmail, userNickname, managementSpaceId };
  } catch (error) {
    throw error;
  }
};
