export const checkEmail = (email: string) => {
  console.log(1);
  if (!email) {
    return { msg: "", color: "" };
  }
  const emailPattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (emailPattern.test(email)) {
    return { msg: "유효한 이메일입니다.", color: "#00cb51" };
  } else {
    return { msg: "형식에 맞게 이메일을 입력해주세요.", color: "red" };
  }
};

export const checkPw = (pw: string) => {
  console.log(2);
  if (!pw) {
    return { msg: "", color: "" };
  }
  const pwPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  if (pwPattern.test(pw)) {
    return { msg: "유효한 비밀번호입니다.", color: "#00cb51" };
  } else {
    return {
      msg: "숫자/영문/특수문자를 조합해 8~16자로 입력해주세요.",
      color: "red",
    };
  }
};

export const checkPwConfirm = (pw: string, pwConfirm: string) => {
  console.log(pw, pwConfirm);
  if (!pwConfirm) {
    return { msg: "", color: "" };
  }
  const pwPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  if (!pwPattern.test(pw)) {
    return { msg: "", color: "" };
  }
  if (pw === pwConfirm) {
    return { msg: "비밀번호와 일치합니다.", color: "#00cb51" };
  } else {
    return {
      msg: "비밀번호와 일치하지 않습니다.",
      color: "red",
    };
  }
};
