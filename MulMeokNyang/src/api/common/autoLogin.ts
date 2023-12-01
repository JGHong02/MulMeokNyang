import axios from "axios";

// Case 1. 자동 로그인이 설정되어 있지 않은 사용자 -> 자동 로그인을 새로 설정
export const setAutoLogin = async (email: string) => {
  console.log("-----setAutoLogin API 호출 중-----");
  console.log("email :", email);

  try {
    const res = await axios.post(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/autoLoginCase1",
      { userEmail: email }
    );
    const managementSpaceId = res.data.managementSpaceId;
    const sessionID = res.data.sessionID;
    console.log("managementSpaceId :", managementSpaceId);
    console.log("sessionID :", sessionID);

    return { managementSpaceId, sessionID };
  } catch (error: any) {
    console.log("setAutoLogin API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};

// Case 2. 자동 로그인이 설정된 사용자 -> DB에서 로그인 상태를 유지할 데이터 받아오기
export const getAutoLoginInfo = async (sessionID: string) => {
  console.log("-----getAutoLoginInfo API 호출 중-----");
  console.log("sessionID :", sessionID);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/autoLoginCase2",
      {
        params: { sessionID: sessionID },
      }
    );
    const userEmail = res.data.userEmail;
    const managementSpaceId = res.data.managementSpaceId;
    console.log("userEmail :", userEmail);
    console.log("managementSpaceId :", managementSpaceId);

    return { userEmail, managementSpaceId };
  } catch (error: any) {
    console.log(
      "getAutoLoginInfo API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
