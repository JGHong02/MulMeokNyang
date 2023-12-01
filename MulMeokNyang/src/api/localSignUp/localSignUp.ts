import axios from "axios";

export const localSignUp = async (
  email: string,
  pw: string,
  name: string,
  phoneNum: string
) => {
  console.log("-----logcalSignUp API 호출 중-----");
  console.log("email :", email);
  console.log("pw :", pw);
  console.log("name :", name);
  console.log("phoneNum :", phoneNum);

  try {
    const res = await axios.post(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/localSignUp",
      {
        userEmail: email,
        userPw: pw,
        userName: name,
        userPhoneNum: phoneNum,
      }
    );
    const signUpSuccess = res.data.signUpSuccess;
    console.log("signUpSuccess :", signUpSuccess);

    return signUpSuccess;
  } catch (error: any) {
    console.log(
      "localSignUp API 호출 함수에서 error 발생 :",
      error.res.message
    );
    throw error;
  }
};
