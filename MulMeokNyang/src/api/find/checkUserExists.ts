import axios from "axios";

export const checkUserExists = async (email: string, phoneNum: string) => {
  console.log("-----checkUserExists API 호출 중-----");
  console.log("email :", email);
  console.log("phoneNum :", phoneNum);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/checkUserExists",
      {
        params: {
          userEmail: email,
          userPhoneNum: phoneNum,
        },
      }
    );
    const userExists = res.data.userExists;
    console.log("userExists :", userExists);

    return userExists;
  } catch (error: any) {
    console.log(
      "checkUserExists API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
