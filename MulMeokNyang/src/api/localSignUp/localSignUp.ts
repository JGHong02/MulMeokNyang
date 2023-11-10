import axios from "axios";

export const localSignUp = async (
  email: string,
  pw: string,
  name: string,
  phoneNum: string
) => {
  try {
    const res = await axios.post("/localSignUp", {
      userEmail: email,
      userPw: pw,
      userName: name,
      userPhoneNum: phoneNum,
    });
    const signUpSuccess = res.data.signUpSuccess;
    return signUpSuccess;
  } catch (error: any) {
    console.log("localSignUp API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
