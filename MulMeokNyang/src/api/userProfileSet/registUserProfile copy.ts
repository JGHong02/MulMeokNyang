import axios from "axios";
import FormData from "form-data";

export const registUserProfile = async (
  profilePhoto: string,
  nickname: string,
  introduction: string
) => {
  try {
    const localUri = profilePhoto;
    // 파일 이름 추출
    const filename = localUri.split("/").pop();
    // 파일 이름에서 확장자 추출
    const match = /\.(\w+)$/.exec(filename ?? "");
    // 이미지의 MIME 유형 생성
    const type = match ? `image/${match[1]}` : `image`;

    // FormData 객체 생성
    const formData = new FormData();

    // 'userProfilePhoto'를 'multipart/form-data'로 추가
    formData.append("userProfilePhoto", {
      uri: localUri,
      name: filename,
      type,
    });

    // 다른 데이터를 JSON 형식으로 객체에 담고 FormData에 추가
    const jsonData = {
      userNickname: nickname,
      userIntroduction: introduction,
    };
    formData.append("jsonData", JSON.stringify(jsonData));

    // Axios를 사용하여 수정된 FormData를 POST 요청으로 보냄
    const res = await axios.post("/registUserProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 중복되는 닉네임인 경우
    if (res.hasOwnProperty("nicknameExists")) {
      const nicknameExists = res.data.nicknameExists;
      return { nicknameExists };
    }

    // 사용자 프로필 등록 성공
    const registDone = res.data.registDone;
    return { registDone };
  } catch (error) {
    throw error;
  }
};
