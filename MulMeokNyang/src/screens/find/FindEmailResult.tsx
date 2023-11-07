// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useContext, useEffect } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import ProcessButton from "../../components/button/ProcessButton";
// styles
import mainViewStyles from "../../styles/mainViewStyles";

const FindEmailResult = () => {
  // userEmail 전역 변수와 setter 함수 불러오기
  const { userEmailGV, setUserEmailGV } = useContext(UserContext);

  // Unmount될 때 전역 변수 값 초기화
  useEffect(() => {
    return () => {
      setUserEmailGV("");
    };
  }, []);

  return (
    <SafeAreaView>
      <TopBar title="이메일 찾기" />
      <View style={[mainViewStyles.mainView]}>
        <View style={[styles.textView]}>
          <Text style={[styles.text]}>회원님의 이메일은</Text>
          <Text style={[styles.text, styles.userEmailText]}>{userEmailGV}</Text>
          <Text style={[styles.text]}>입니다.</Text>
        </View>
        <View style={[styles.buttonView]}>
          <ProcessButton content="로그인" canPress route="Login" halfSize />
          <View style={[styles.emptyView]} />
          <ProcessButton
            content="비밀번호 찾기"
            canPress
            route="FindPw"
            halfSize
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FindEmailResult;

const styles = StyleSheet.create({
  textView: {
    marginTop: 90,
    marginBottom: 90,
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    marginBottom: 10,
  },
  userEmailText: {
    color: "#004aad",
    textDecorationLine: "underline",
  },
  buttonView: {
    flexDirection: "row",
  },
  emptyView: {
    width: 25,
  },
});
