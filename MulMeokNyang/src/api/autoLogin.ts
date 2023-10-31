import axios from "axios";

// 자동 로그인이 설정되어 있지 않은 사용자 -> 자동 로그인을 새로 설정
export const setAutoLogin = async (email: string) => {
  try {
    const res = await axios.post("/autoLogin", { userEmail: email });
    const userEmail = res.data.userEmail;
    let managementSpaceId = null;
    // managementSpaceId이 있다면
    if (res.data.hasOwnProperty("managementSpaceId")) {
      managementSpaceId = res.data.managementSpaceId;
    }
    const sessionID = res.data.sessionID;
    return [userEmail, managementSpaceId, sessionID];
  } catch (error) {
    throw error;
  }
};

// 자동 로그인이 설정된 사용자 -> DB에서 로그인 상태를 유지할 데이터 받아오기
export const autoLogin = async (sessionID: string) => {
  try {
    const res = await axios.get("/autoLogin", {
      params: { sessionID: sessionID },
    });
    const userEmail = res.data.userEmail;
    let managementSpaceId = null;
    if (res.data.hasOwnProperty("managementSpaceId")) {
      managementSpaceId = res.data.managementSpaceId;
    }
    return [userEmail, managementSpaceId];
  } catch (error) {
    throw error;
  }
};
