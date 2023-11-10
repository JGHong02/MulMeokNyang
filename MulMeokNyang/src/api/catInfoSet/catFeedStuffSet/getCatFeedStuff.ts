
export const getCatFeedStuff = async (spaceId: string, id: string) => {
  try {
    const res = await axios.get("/getCatFeedStuff", {
      params: {
        managementSpaceId: spaceId,
        catId: id,
      },
    });
