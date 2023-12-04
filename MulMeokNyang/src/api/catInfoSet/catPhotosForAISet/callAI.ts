import axios from "axios";
import FormData from "form-data";
import localUriToFormData from "../../../utils/localUriToFormData";

export const callAI = async (photoUris: string[]) => {
  console.log("-----callAI API 호출 중-----");
  console.log("photoUris :", photoUris);

  try {
    // 1. FormData 객체 생성
    const formData = new FormData();

    // 2. 사용자로부터 받은 localUri를 formData 형식으로 변환 (배열 처리)
    for (let i = 0; i < 5; i++) {
      const photoFormData = await localUriToFormData(photoUris[i]);
      console.log(`photoFormData of ${i} :`, photoFormData);

      formData.append(`file`, {
        uri: photoUris[i],
        name: photoFormData.filename,
        type: photoFormData.type,
      });
    }

    // 시간 측정
    const start = performance.now();

    // 3. req 전송
    const res = await axios.post(
      // 현 IP 주소로 고쳐야 함
      "http://172.30.13.189:5000/catClassification",
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

    const result = res.data;
    console.log("AI Result :", result);

    const end = performance.now();
    const duration = end - start;
    console.log(`소요된 시간: ${duration} 밀리초`);

    return result;
  } catch (error: any) {
    console.log("callAI API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
