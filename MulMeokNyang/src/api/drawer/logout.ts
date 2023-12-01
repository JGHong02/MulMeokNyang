import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const logout = async (email: string) => {
  console.log("-----logout API 호출 중-----");
  console.log("email :", email);

  try {
    const res = await axios.delete(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/logout",
      {
        data: {
          userEmail: email,
        },
      }
    );

    const logoutSuccess = res.data.logoutSuccess;
    console.log("logoutSuccess :", logoutSuccess);

    if (logoutSuccess) {
      await AsyncStorage.removeItem("sessionID");
    }
    return logoutSuccess;
  } catch (error: any) {
    console.log("logout API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
