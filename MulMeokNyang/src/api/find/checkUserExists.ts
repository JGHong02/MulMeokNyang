import axios from "axios";

export const checkUserExists = async (email: string, phoneNum: string) => {
  try {
    const res = await axios.get("/checkUserExits", {
      params: {
        userEmail: email,
        userPhoneNum: phoneNum,
      },
    });
    const userExists = res.data.userExists;
    return userExists;
  } catch (error) {
    throw error;
  }
};
