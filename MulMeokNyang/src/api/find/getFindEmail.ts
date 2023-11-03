import axios from "axios";

export const getFindEmail = async (name: string, phoneNum: string) => {
  try {
    const res = await axios.get("/findEmail", {
      params: {
        userName: name,
        userPhoneNum: phoneNum,
      },
    });
    const userEmail = res.data.userEmail;
    return userEmail;
  } catch (error) {
    throw error;
  }
};
