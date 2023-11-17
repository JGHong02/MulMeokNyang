import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const logout = async (email: string) => {
  try {
    const res = await axios.delete("/logout", {
      data: {
        userEmail: email,
      },
    });

    const logoutSuccess = res.data.logoutSuccess;
    if (logoutSuccess) {
      await AsyncStorage.removeItem("sessionID");
    }
    return logoutSuccess;
  } catch (error: any) {
    console.log("logout API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
