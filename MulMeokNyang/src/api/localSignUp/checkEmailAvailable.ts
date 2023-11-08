import axios from "axios";

export const checkEmailAvailable = async (email: string) => {
  try {
    const res = await axios.get("/checkEmailAvailable", {
      params: { userEmail: email },
    });
    const available = res.data.available;
    return available;
  } catch (error: any) {
    console.log(
      "checkEmailAvailable API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
