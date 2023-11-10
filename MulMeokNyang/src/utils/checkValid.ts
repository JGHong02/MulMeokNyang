import { checkEmailAvailable as checkAvailable } from "../api/localSignUp/checkEmailAvailable";

export const checkEmpty = (value: string) => {
  if (value) return [{ msg: "", color: "" }, true];
  return [{ msg: "", color: "" }, false];
};

export const checkEmail = (email: string) => {
  console.log(1, "email :", email);
  if (!email) {
    return [{ msg: "", color: "" }, false];
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(email)) {
    return [{ msg: "유효한 이메일입니다.", color: "#00cb51" }, true];
  } else {
    return [{ msg: "형식에 맞게 이메일을 입력해주세요.", color: "red" }, false];
  }
};

export const checkEmailAvailable = async (email: string) => {
  console.log(2, "email :", email);
  if (!email) {
    return [{ msg: "", color: "" }, false];
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(email)) {
    const available = await checkAvailable(email);
    if (available) {
      return [{ msg: "사용 가능한 이메일입니다.", color: "#00cb51" }, true];
    } else {
      return [{ msg: "이미 가입된 이메일입니다.", color: "red" }, true];
    }
  } else {
    return [{ msg: "형식에 맞게 이메일을 입력해주세요.", color: "red" }, false];
  }
};

export const checkPw = (pw: string) => {
  console.log(3, "pw :", pw);
  if (!pw) {
    return [{ msg: "", color: "" }, false];
  }
  const pwPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  if (pwPattern.test(pw)) {
    return [{ msg: "유효한 비밀번호입니다.", color: "#00cb51" }, true];
  } else {
    return [
      {
        msg: "숫자/영문/특수문자를 조합해 8~16자로 입력해주세요.",
        color: "red",
      },
      false,
    ];
  }
};

export const checkPwConfirm = (pwConfirm: string, pw: string) => {
  console.log(4, "pw :", pw, "pwConfirm :", pwConfirm);
  if (!pwConfirm) {
    return [{ msg: "", color: "" }, false];
  }
  const pwPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  if (!pwPattern.test(pw)) {
    return [{ msg: "", color: "" }, false];
  }
  if (pw === pwConfirm) {
    return [{ msg: "비밀번호와 일치합니다.", color: "#00cb51" }, true];
  } else {
    return [
      {
        msg: "비밀번호와 일치하지 않습니다.",
        color: "red",
      },
      false,
    ];
  }
};

export const checkPhoneNum = (phoneNum: string) => {
  console.log(5, "phoneNum :", phoneNum);
  if (!phoneNum) {
    return [{ msg: "", color: "" }, false];
  }
  const phoneNumPattern = /^\d{3}-\d{4}-\d{4}$/;
  if (phoneNumPattern.test(phoneNum)) {
    return [{ msg: "", color: "" }, true];
  } else {
    return [
      { msg: "'-' 을 포함하여 전화번호를 입력해주세요.", color: "red" },
      false,
    ];
  }
};
