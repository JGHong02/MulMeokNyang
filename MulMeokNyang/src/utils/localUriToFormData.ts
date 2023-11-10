const localUriToFormData = (localUri: string) => {
  // 파일 이름 추출
  const filename = localUri.split("/").pop();
  // 파일 이름에서 확장자 추출
  const match = /\.(\w+)$/.exec(filename ?? "");
  // 이미지의 MIME 유형 생성
  const type = match ? `image/${match[1]}` : `image`;

  return { filename, type };
};

export default localUriToFormData;
