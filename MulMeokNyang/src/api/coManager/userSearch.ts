import axios from "axios";

export const userSearch = async (nickname: string) => {
  console.log("-----userSearch API 호출 중-----");
  console.log("nickname :", nickname);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/userSearch",
      {
        params: {
          userNickname: nickname,
        },
      }
    );

    // 검색 결과가 없는 경우
    if (
      res.data.hasOwnProperty("searchResultExists") &&
      !res.data.searchResultExists
    ) {
      const searchResultExists = res.data.searchResultExists;
      console.log("searchResultExists :", searchResultExists);

      return { searchResultExists };
    }

    // 검색 결과가 있는 경우
    const userEmail = res.data.userEmail;
    const userProfilePhotoUrl = res.data.userProfilePhoto;
    const userIntroduction = res.data.userIntroduction;
    console.log("userEmail :", userEmail);
    console.log("userProfilePhotoUrl :", userProfilePhotoUrl);
    console.log("userIntroduction :", userIntroduction);

    return { userEmail, userProfilePhotoUrl, userIntroduction };
  } catch (error: any) {
    console.log("userSearch API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
