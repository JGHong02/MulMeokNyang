import axios from "axios";
import FormData from "form-data";
import localUriToFormData from "../../utils/localUriToFormData";

export const modifyUserProfile = async (
  email: string,
  profilePhotoUrl: string,
  nickname: string,
  introduction: string
) => {
  console.log("-----modifyUserProfile API 호출 중-----");
  console.log("email :", email);
  console.log("profilePhotoUrl :", profilePhotoUrl);
  console.log("nickname :", nickname);
  console.log("introduction :", introduction);

  try {
    // 1. FormData 객체 생성
    const formData = new FormData();

    // 2-1. 프로필 사진을 올린 경우
    if (profilePhotoUrl) {
      // 사용자로부터 받은 localUri를 formData 형식으로 변환
      const photoFormData = await localUriToFormData(profilePhotoUrl);
      console.log("photoFormData :", photoFormData);

      // 3. 'userProfilePhoto'를 'multipart/form-data'로 추가
      formData.append("userProfilePhoto", {
        uri: profilePhotoUrl,
        name: photoFormData.filename,
        type: photoFormData.type,
      });
    } else {
      // 2-2. 프로필 사진을 올리지 않은 경우
      formData.append("userProfilePhoto", "");
    }

    // 4. 나머지 데이터 FormData에 추가
    formData.append("userEmail", email);
    formData.append("userNickname", nickname);
    formData.append("userIntroduction", introduction);

    // 5. Axios를 사용하여 수정할 FormData를 PUT 요청으로 보냄
    const res = await axios.put(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/modifyUserProfile",
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

    // 중복되는 닉네임인 경우
    if (res.data.hasOwnProperty("nicknameExists")) {
      const nicknameExists = res.data.nicknameExists;
      return { nicknameExists };
    }

    // 사용자 프로필 수정 성공
    const modifySuccess = res.data.modifySuccess;
    return { modifySuccess };
  } catch (error: any) {
    console.log(
      "modifyUserProfile API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
