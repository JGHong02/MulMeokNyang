import axios from "axios";
import FormData from "form-data";
import localUriToFormData from "../../utils/localUriToFormData";

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
  console.log("-----registCatInfo API 호출 중-----");
  console.log("email :", email);
  console.log("spaceId :", spaceId);
  console.log("profilePhotoUrl :", profilePhotoUrl);
  console.log("name :", name);
  console.log("age :", age);
  console.log("weight :", weight);
  console.log("photosUrlForAI :", photosUrlForAI);
  console.log("isEating :", isEating);
  console.log("dailyConsumption :", dailyConsumption);
  console.log("isAuto :", isAuto);
  console.log("goalHydration :", goalHydration);

  try {
    // FormData 객체 생성
    const formData = new FormData();

    // 1) catProfilePhotoUrl 처리
    // 2-1. 프로필 사진을 올린 경우
    if (profilePhotoUrl) {
      // 사용자로부터 받은 localUri를 formData 형식으로 변환
      const profilePhotoFormData = await localUriToFormData(profilePhotoUrl);
      console.log("profilePhotoFormData :", profilePhotoFormData);

      // 3. 'catProfilePhoto'를 'multipart/form-data'로 추가
      formData.append("catProfilePhoto", {
        uri: profilePhotoUrl,
        name: profilePhotoFormData.filename,
        type: profilePhotoFormData.type,
      });
    } else {
      // 2-2. 프로필 사진을 올리지 않은 경우
      formData.append("catProfilePhoto", "");
    }

    // // 2) catPhotosUrlForAI (배열) 처리
    // // 1. 반복문을 돌며 각 이미지 처리
    // const catPhotosUrlForAIArr = [];
    // for (let i = 0; i < 5; i++) {
    //   const photoUrlForAI = photosUrlForAI[i];
    //   const photoForAIFormData = await localUriToFormData(photoUrlForAI);
    //   catPhotosUrlForAIArr.push({
    //     uri: photoUrlForAI,
    //     name: photoForAIFormData.filename,
    //     type: photoForAIFormData.type,
    //   });
    // }

    // // 2. 'catPhotosUrlForAI'를 'multipart/form-data'의 배열로 추가
    // formData.append("catPhotosForAI", JSON.stringify(catPhotosUrlForAIArr));

    // 3) 나머지 데이터 FormData에 추가
    formData.append("userEmail", email);
    formData.append("managementSpaceId", spaceId ? spaceId : null);
    formData.append("catName", name);
    formData.append("catAge", age);
    formData.append("catWeight", weight);
    formData.append("isEatingFeedStuff", isEating);
    formData.append("catFeedStuffDailyConsumption", dailyConsumption);
    formData.append("catFeedStuffMoistureContent", moistureContent);
    formData.append("isHydrationAuto", isAuto);
    formData.append("catGoalHydration", goalHydration);

    const res = await axios.post(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/registCatInfo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          return data;
        },
      }
    );

    console.log("----------------------");

    // 처음 고양이 프로필을 등록하는 사용자 (= 아직 관리 스페이스가 없는 사용자)
    if (res.data.hasOwnProperty("spaceId")) {
      const spaceId = res.data.spaceId;
      console.log("관리 스페이스 첫 등록 spaceId :", spaceId);

      return { spaceId };
    }

    // 고양이 프로필을 추가 등록하는 중이었던 사용자 (= 관리 스페이스가 이미 있는 사용자)
    if (res.data.hasOwnProperty("addSuccess")) {
      const addSuccess = res.data.addSuccess;
      console.log("addSuccess :", addSuccess);

      return addSuccess;
    }
  } catch (error: any) {
    console.log("registCatInfo API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
