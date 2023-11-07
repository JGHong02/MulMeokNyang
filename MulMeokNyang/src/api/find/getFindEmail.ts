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
  } catch (error) {
    console.log("getFindEmail에서 Error 발생", error);
  }
};
