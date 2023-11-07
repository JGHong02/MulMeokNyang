import axios from "axios";

export const getManagementSpaceId = async (email: string) => {
  try {
    const res = await axios.get("/getManagementSpaceId", {
      params: {
        userEmail: email,
      },
    });
    const managementSpaceId = res.data.managementSpaceId;
    return managementSpaceId;
  } catch (error) {
    console.log("getManagementSpaceId에서 Error 발생", error);
  }
};
