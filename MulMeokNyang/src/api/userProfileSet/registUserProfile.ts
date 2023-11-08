import axios from "axios";
import FormData from "form-data";

export const registUserProfile = async (
  email: string,
  profilePhotoUrl: string,
  nickname: string,
  introduction: string
) => {
  try {
    const localUri = profilePhotoUrl;
    // 파일 이름 추출
    const filename = localUri.split("/").pop();
    // 파일 이름에서 확장자 추출
    const match = /\.(\w+)$/.exec(filename ?? "");
    // 이미지의 MIME 유형 생성
    const type = match ? `image/${match[1]}` : `image`;

    // 1. FormData 객체 생성
    const formData = new FormData();

    // 2. 'userProfilePhoto'를 'multipart/form-data'로 추가
    formData.append("userProfilePhoto", {
      uri: localUri,
      name: filename,
      type,
    });

    // 3. 다른 데이터를 JSON 형식으로 객체에 담고 FormData에 추가
    const jsonData = {
      userEmail: email,
      userNickname: nickname,
      userIntroduction: introduction,
    };
    formData.append("jsonData", JSON.stringify(jsonData));

    // 4. Axios를 사용하여 수정된 FormData를 POST 요청으로 보냄
    const res = await axios.post("/registUserProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 응답을 필요에 맞게 처리
    if (res.hasOwnProperty("nicknameExists")) {
      const nicknameExists = res.data.nicknameExists;
      return { nicknameExists };
    }

    const registSuccess = res.data.registSuccess;
    return { registSuccess };
  } catch (error: any) {
    console.log(
      "registUserProfile API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
