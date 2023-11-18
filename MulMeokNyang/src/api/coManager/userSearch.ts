import axios from "axios";

export const userSearch = async (nickname: string) => {
  try {
    const res = await axios.get("/userSearch", {
      params: {
        userNickname: nickname,
      },
    });

    // 검색 결과가 없는 경우
    if (
      res.data.hasOwnProperty("searchResultExists") &&
      !res.data.searchResultExists
    ) {
      const searchResultExists = res.data.searchResultExists;
      return { searchResultExists };
    }

    // 검색 결과가 있는 경우
    const userEmail = res.data.userEmail;
    const userProfilePhotoUrl = res.data.userProfilePhotoUrl;
    const userIntroduction = res.data.userIntroduction;
    return { userEmail, userProfilePhotoUrl, userIntroduction };
  } catch (error: any) {
    console.log("userSearch API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
