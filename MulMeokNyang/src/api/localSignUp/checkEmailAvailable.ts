import axios from "axios";

export const checkEmailAvailable = async (email: string) => {
  try {
    const res = await axios.get("/checkEmailAvailable", {
      params: { userEmail: email },
    });
    const available = res.data.available;
    return available;
  } catch (error) {
    throw error;
  }
};
