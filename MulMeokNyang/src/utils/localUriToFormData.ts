const localUriToFormData = async (localUri: string) => {
  // 파일 이름 추출
  const filename = localUri ? localUri.split("/").pop() : "";
  // 파일 이름에서 확장자 추출
  const match = filename ? /\.(\w+)$/.exec(filename ?? "") : "";
  // 이미지의 MIME 유형 생성
  const type = match ? `image/${match[1]}` : `image`;

  return { filename, type };
};

export default localUriToFormData;
