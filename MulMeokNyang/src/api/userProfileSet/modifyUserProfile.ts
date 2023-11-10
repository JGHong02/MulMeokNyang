import axios from "axios";
import FormData from "form-data";
import localUriToFormData from "../../utils/localUriToFormData";

export const modifyUserProfile = async (
  email: string,
  profilePhotoUrl: string,
  nickname: string,
  introduction: string
) => {
  try {
    // 1. 사용자로부터 받은 localUri를 formData 형식으로 변환
    const photoFormData = localUriToFormData(profilePhotoUrl);

    // 2. FormData 객체 생성
    const formData = new FormData();

    // 3. 'userProfilePhoto'를 'multipart/form-data'로 추가
    formData.append("userProfilePhoto", {
      uri: profilePhotoUrl,
      name: photoFormData.filename,
      type: photoFormData.type,
    });

    // 4. 나머지 데이터를 JSON 형식으로 객체에 담고 FormData에 추가
    const jsonData = {
      userEmail: email,
      userNickname: nickname,
      userIntroduction: introduction,
    };
    formData.append("jsonData", JSON.stringify(jsonData));

    // 5. Axios를 사용하여 수정할 FormData를 PUT 요청으로 보냄
    const res = await axios.put("/modifyUserProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 중복되는 닉네임인 경우
    if (res.hasOwnProperty("nicknameExists")) {
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
