import axios from "axios";

export const checkEmailAvailable = async (email: string) => {
  console.log("-----checkEmailAvailable API 호출 중-----\n이메일 :", email);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/checkEmailAvailable",
      {
        params: { userEmail: email },
      }
    );
    const available = res.data.available;
    console.log("available :", available);

    return available;
  } catch (error: any) {
    console.log(
      "checkEmailAvailable API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
