// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useContext, useState, useCallback, useEffect, useRef } from "react";
// Custom Hook
import { useGoRoute } from "../../hooks/useGoScreen";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import Loading from "../../components/Loading";
// API
import { getManagementSpaceId } from "../../api/pendingCoManagerAddition/getManagementSpaceId";
// styles
import mainViewStyles from "../../styles/mainViewStyles";

const PendingCoManagerAddition = () => {
  // managementSpaceId setter 함수 불러오기
  const { userEmailGV, managementSpaceIdGV, setManagementSpaceIdGV } =
    useContext(UserContext);

  // Loading state
  const [onLoading, setOnLoading] = useState<any>(true);

  // forInterval state
  const [forIntervalCnt, setForIntervalCnt] = useState<number>(0);

  // managementSpaceId 전역 변수에 저장한 뒤 화면 이동
  const goMain = useGoRoute("Main");

  // getManagementSpaceId 호출하여, managementSpaceId 값이 있다면 전역 변수에 저장하고
  // loading을 check로 바꾸며, 1초 후에 main 화면으로 이동
  const waitCoManagerAddition = useCallback(async () => {
    const managementSpaceId = await getManagementSpaceId(userEmailGV);

    if (managementSpaceId) {
      setManagementSpaceIdGV(managementSpaceId);
      setOnLoading(false);
      setTimeout(goMain, 1000);
    }
  }, []);

  // 5초마다 waitCoManagerAddition 함수 호출
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (managementSpaceIdGV) return;

      waitCoManagerAddition();
      setForIntervalCnt((prev) => prev + 1);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [forIntervalCnt, managementSpaceIdGV]);

  return (
    <SafeAreaView>
      <TopBar title="공동 관리자 등록 대기" />
      <View style={[mainViewStyles.mainView, styles.mainView]}>
        <View style={[styles.textView]}>
          <Text
            style={[
              styles.text,
            ]}>{`대표 관리자에게 공동 관리자 등록을\n마쳐달라고 해주세요!`}</Text>
          <Text
            style={[
              styles.subText,
            ]}>{`공동 관리자로 등록이 완료 되면\n자동으로 관리 스페이스로 이동합니다.`}</Text>
        </View>
        <Loading onLoading={onLoading} />
      </View>
    </SafeAreaView>
  );
};

export default PendingCoManagerAddition;

const styles = StyleSheet.create({
  mainView: {
    justifyContent: "center",
    height: 600,
  },
  textView: {
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    lineHeight: 50,
    textAlign: "center",
  },
  subText: {
    fontSize: 15,
    color: "#464646",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 30,
  },
});
