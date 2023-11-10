import axios from "axios";
import FormData from "form-data";
import localUriToFormData from "../../../utils/localUriToFormData";

export const registCatInfo = async (
  email: string,
  spaceId: string,
  profilePhotoUrl: string,
  name: string,
  age: string,
  weight: string,
  photosUrlForAI: string[],
  isEating: boolean,
  dailyConsumption: string,
  moistureContent: string,
  isAuto: boolean,
  goalHydration: string
) => {
  // ####################전달인자 확인#####################
  console.log(
    email,
    `\n`,
    spaceId,
    `\n`,
    profilePhotoUrl,
    `\n`,
    name,
    `\n`,
    age,
    `\n`,
    weight,
    `\n`,
    photosUrlForAI,
    `\n`,
    isEating,
    `\n`,
    dailyConsumption,
    `\n`,
    moistureContent,
    `\n`,
    isAuto,
    `\n`,
    goalHydration,
    `\n`
  );
  try {
    // FormData 객체 생성
    const formData = new FormData();

    // 1) catProfilePhotoUrl 처리
    // 1. 사용자로부터 받은 localUri를 formData 형식으로 변환
    const profilePhotoFormData = localUriToFormData(profilePhotoUrl);

    // 2. 'catProfilePhoto'를 'multipart/form-data'로 추가
    formData.append("catProfilePhoto", {
      uri: profilePhotoUrl,
      name: profilePhotoFormData.filename,
      type: profilePhotoFormData.type,
    });

    // 2) catPhotosUrlForAI (배열) 처리
    // 1. 반복문을 돌며 각 이미지 처리
    const catPhotosUrlForAIArr = [];
    for (let i = 0; i < 5; i++) {
      const photoUrlForAI = photosUrlForAI[i];
      const photoForAIFormData = localUriToFormData(photoUrlForAI);
      catPhotosUrlForAIArr.push({
        uri: photoUrlForAI,
        name: photoForAIFormData.filename,
        type: photoForAIFormData.type,
      });
    }

    // 2. 'catPhotosUrlForAI'를 'multipart/form-data'의 배열로 추가
    formData.append("catPhotosForAI", catPhotosUrlForAIArr);

    // 3) 나머지 데이터 JSON 형식으로 객체에 담고 FormData에 추가
    const jsonData = {
      userEmail: email,
      managementSpaceId: spaceId,
      catName: name,
      catAge: age,
      catWeight: weight,
      isEatingFeedStuff: isEating,
      catFeedStuffDailyConsumption: dailyConsumption,
      catFeedStuffMoistureContent: moistureContent,
      isHydrationAuto: isAuto,
      catGoalHydration: goalHydration,
    };
    formData.append("jsonData", JSON.stringify(jsonData));

    const res = await axios.post("/registCatInfo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 처음 고양이 프로필을 등록하는 사용자 (= 아직 관리 스페이스가 없는 사용자)
    if (res.data.hasOwnProperty("spaceId")) {
      return { spaceId };
    }

    // 고양이 프로필을 추가 등록하는 중이었던 사용자 (= 관리 스페이스가 이미 있는 사용자)
    if (res.data.hasOwnProperty("addSuccess")) {
      const addSuccess = res.data.addSuccess;
      return addSuccess;
    }
  } catch (error: any) {
    console.log("registCatInfo API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
