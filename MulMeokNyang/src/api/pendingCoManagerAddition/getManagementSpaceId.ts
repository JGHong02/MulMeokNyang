import axios from "axios";

export const getManagementSpaceId = async (email: string) => {
  const res = await axios.get("/getManagementSpaceId", {
    params: {
      userEmail: email,
    },
  });
  const managementSpaceId = res.data.managementSpaceId;
  return managementSpaceId;
};
