import axios from "axios";
import FormData from "form-data";
import localUriToFormData from "../../utils/localUriToFormData";

export const registUserProfile = async (
  email: string,
  profilePhotoUrl: string,
  nickname: string,
  introduction: string
) => {
  try {
    // 1. 사용자로부터 받은 localUri를 formData 형식으로 변환
    const photoFormData = await localUriToFormData(profilePhotoUrl);

    // 2. FormData 객체 생성
    const formData = new FormData();

    console.log(profilePhotoUrl);
    console.log(photoFormData.file, photoFormData.filename, photoFormData.type);

    // 3. 'userProfilePhoto'를 'multipart/form-data'로 추가
    formData.append("userProfilePhoto", {
      uri: profilePhotoUrl,
      name: photoFormData.filename,
      type: photoFormData.type,
      // data: photoFormData.file,
    });

    // 4. 나머지 데이터를 JSON 형식으로 객체에 담고 FormData에 추가
    const jsonData = {
      userEmail: email,
      userNickname: nickname,
      userIntroduction: introduction,
    };
    formData.append("jsonData", JSON.stringify(jsonData));

    // 5. Axios를 사용하여 등록할 FormData를 POST 요청으로 보냄
    const res = await axios.post(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/registUserProfile",
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

    console.log("-----------");

    // 중복되는 닉네임인 경우
    // if (res.data.hasOwnProperty("nicknameExists")) {
    if (Object.prototype.hasOwnProperty.call(res.data, "nicknameExists")) {
      const nicknameExists = res.data.nicknameExists;
      return { nicknameExists };
    }

    console.log("요까지 왔는가?");

    // 사용자 프로필 등록 성공
    const registSuccess = res.data.registDone;
    if (registSuccess) {
      console.log("성공했다!!!!!!!!!!!");
      return { registSuccess };
    }
  } catch (error: any) {
    console.log(
      "registUserProfile API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
