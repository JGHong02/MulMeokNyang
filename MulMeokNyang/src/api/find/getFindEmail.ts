import axios from "axios";

export const getFindEmail = async (name: string, phoneNum: string) => {
  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getUserEmail",
      {
        params: {
          userName: name,
          userPhoneNum: phoneNum,
        },
      }
    );
    const userEmail = res.data.userEmail;
    return userEmail;
  } catch (error: any) {
    if (error.response.status === 404) {
      console.log("안녕?", error.response.data.error);
    }
    console.log("getFindEmail API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
