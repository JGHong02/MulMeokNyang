const fetchImageUri = async (uri: string) => {
  const res = await fetch(uri);
  const blob = await res.blob();
  return blob;
};

const localUriToFormData = async (localUri: string) => {
  // 바이너리 변환
  const file = await fetchImageUri(localUri);
  // 파일 이름 추출
  const filename = localUri.split("/").pop();
  // 파일 이름에서 확장자 추출
  const match = /\.(\w+)$/.exec(filename ?? "");
  // 이미지의 MIME 유형 생성
  const type = match ? `image/${match[1]}` : `image`;

  return { file, filename, type };
};

export default localUriToFormData;
