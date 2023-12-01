import axios from "axios";

export const getFindEmail = async (name: string, phoneNum: string) => {
  console.log("-----getFindEmail API 호출 중-----");
  console.log("name :", name);
  console.log("phoneNum :", phoneNum);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getFindEmail",
      {
        params: {
          userName: name,
          userPhoneNum: phoneNum,
        },
      }
    );
    const userEmail = res.data.userEmail;
    console.log("userEmail :", userEmail);

    return userEmail;
  } catch (error: any) {
    console.log("getFindEmail API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
