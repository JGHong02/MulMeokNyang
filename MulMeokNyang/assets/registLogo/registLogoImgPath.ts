type registLogoImgPath = {
  // 인덱스 시그니처를 사용하면 객체의 속성 이름과 값의 유형을 동적으로 지정할 수 있음
  [key: string]: any;
  Naver: any;
  Kakao: any;
  Google: any;
};

export const registLogoImgPath: registLogoImgPath = {
  Naver: require("./Naver.png"),
  Kakao: require("./Kakao.png"),
  Google: require("./Google.png"),
};
