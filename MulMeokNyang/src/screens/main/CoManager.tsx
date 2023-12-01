// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useContext, useState, useEffect, useCallback } from "react";
// Custom Hook
import useLoading from "../../hooks/useLoading";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import ManagerCard from "../../components/ManagerCard";
import ProcessButton from "../../components/button/ProcessButton";
import Alert from "../../components/alert/Alert";
import SearchUserAlert from "../../components/alert/SearchUserAlert";
// styles
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";
// API
import { getManagerList } from "../../api/coManager/getManagerList";
import { getUserProfile } from "../../api/common/getUserProfile";
import { deleteCoManager } from "../../api/coManager/deleteCoManager";

const CoManager = () => {
  // API 호출 및 데이터 바인딩 시 사용할 전역변수 불러오기
  const { userEmailGV, managementSpaceIdGV } = useContext(UserContext);

  // ManagerCard 컴포넌트에 바인딩할 state
  const [mainManagerInfo, setMainManagerInfo] = useState({
    profilePhotoUrl: "",
    nickname: "",
    email: "",
    introduction: "",
  });
  const [coManagersInfo, setCoManagersInfo] = useState<
    {
      profilePhotoUrl: string;
      nickname: string;
      email: string;
      introduction: string;
    }[]
  >([]);

  // 공동 관리자 삭제 Alert 관련 state
  const [onDeleteAlert, setOnDeleteAlert] = useState<boolean>(false);
  // 삭제할 email 값 ManagerCard 컴포넌트로에서 설정하고
  // Alert 컴포넌트 buttonPressHandler의 전달인자로 전달
  const [emailToDelete, setEmailToDelete] = useState<string>("");

  // 공동 관리자 추가 ALert 관련 state
  const [onSearchUserAlert, setOnSearchUserAlert] = useState<boolean>(false);
  const [onAddAlert, setOnAddAlert] = useState<boolean>(false);

  // 로딩
  const { isLoading, handleLoading } = useLoading();

  useEffect(() => {
    // 관리자 추가 후 리랜더링 해야 되는데................

    // useEffect에서는 async, await를 직접 쓸 수 없기 때문에
    // async 함수를 선언하고 호출해야 함.
    const saveCoManagersInfo = async () => {
      let mainManagerInfo = {
        profilePhotoUrl: "",
        nickname: "",
        email: "",
        introduction: "",
      };
      let coManagersUserEmailArr = [];
      let coManagersInfo = [];

      try {
        handleLoading(true);

        const getManagerListRes = await getManagerList(managementSpaceIdGV);

        mainManagerInfo.email = getManagerListRes.mainManagerUserEmail;
        coManagersUserEmailArr = getManagerListRes.coManagersUserEmail;

        // mainManager 정보 불러와 저장
        const getMainManagerInfoRes = await getUserProfile(
          mainManagerInfo.email
        );
        mainManagerInfo.profilePhotoUrl =
          getMainManagerInfoRes.userProfilePhoto;
        mainManagerInfo.nickname = getMainManagerInfoRes.userNickname;
        mainManagerInfo.introduction = getMainManagerInfoRes.userIntroduction;

        // 반복문 돌며 coManagers 정보 불러와 저장
        for (let i = 0; i < coManagersUserEmailArr.length; i++) {
          const getCoManagerInfoRes = await getUserProfile(
            coManagersUserEmailArr[i]
          );
          const coManagerInfo = {
            profilePhotoUrl: getCoManagerInfoRes.userProfilePhoto,
            nickname: getCoManagerInfoRes.userNickname,
            email: coManagersUserEmailArr[i],
            introduction: getCoManagerInfoRes.userIntroduction,
          };
          coManagersInfo.push(coManagerInfo);
        }

        // state 값을 바꿔 리렌더링
        setMainManagerInfo(mainManagerInfo);
        setCoManagersInfo(coManagersInfo);
        handleLoading(false);
      } catch (error: any) {
        console.log(
          "CoManager 화면 getManagerList 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };

    saveCoManagersInfo();
  }, []);

  // 공동 관리자 삭제 Alert에서 "예" 버튼 눌렀을 때 실행될 함수
  const deleteAlertButtonPressHandler = useCallback(async (email: string) => {
    try {
      handleLoading(true);

      // Alert 닫기
      setOnDeleteAlert(false);

      await deleteCoManager(managementSpaceIdGV, email);

      // coManagerInfo에서 해당 공동 관리자 정보 제거
      setCoManagersInfo((prev) =>
        prev.filter((value) => value.email !== email)
      );

      handleLoading(false);
    } catch (error: any) {
      console.log(
        "CoManager 화면 deleteCoManager 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }
  }, []);

  return (
    <SafeAreaView>
      <TopBar title="공동 관리자" />
      <View style={[styles.mainView]}>
        {isLoading ? (
          <View style={[styles.loadingView]}>
            <ActivityIndicator size="large" color="#59a0ff" />
          </View>
        ) : (
          <>
            <View style={[styles.managerListView]}>
              <Text style={[styles.text]}>대표 관리자</Text>
              <ManagerCard
                isMainManager
                profilePhotoUrl={mainManagerInfo.profilePhotoUrl}
                nickname={mainManagerInfo.nickname}
                email={mainManagerInfo.email}
                introduction={mainManagerInfo.introduction}
                onDeleteButton={false}
              />
              <View
                style={[
                  styles.coManagerListView,
                  // MainManager가 아니면 processButton 필요 없으니까 coManagerListView height를 더 길게
                  mainManagerInfo.email !== userEmailGV && { height: 450 },
                ]}>
                <Text style={[styles.text]}>공동 관리자</Text>
                <FlatList
                  data={coManagersInfo}
                  renderItem={({ item }) => (
                    <ManagerCard
                      profilePhotoUrl={item.profilePhotoUrl}
                      nickname={item.nickname}
                      email={item.email}
                      introduction={item.introduction}
                      onDeleteButton={
                        mainManagerInfo.email === userEmailGV ? true : false
                      }
                      setOnDeleteAlert={
                        mainManagerInfo.email === userEmailGV
                          ? setOnDeleteAlert
                          : () => {}
                      }
                      setEmailToDelete={
                        mainManagerInfo.email === userEmailGV
                          ? setEmailToDelete
                          : () => {}
                      }
                    />
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.itemSeparator]} />
                  )}
                />
              </View>
            </View>
            {mainManagerInfo.email === userEmailGV && (
              <ProcessButton
                content="공동 관리자 추가"
                canPress
                onPressHandler={() => setOnSearchUserAlert(true)}
              />
            )}
          </>
        )}
      </View>
      <View
        style={
          (onDeleteAlert || onSearchUserAlert || onAddAlert) &&
          alertBackgroundStyles.alertBackgroundView
        }>
        {onDeleteAlert && (
          <Alert
            msg={`관리자를\n삭제하시겠습니까?`}
            setOnAlert={setOnDeleteAlert}
            isButton
            buttonContent="예"
            buttonPressHandler={() =>
              deleteAlertButtonPressHandler(emailToDelete)
            }
          />
        )}
        {onSearchUserAlert && (
          <SearchUserAlert
            spaceId={managementSpaceIdGV}
            setOnSearchUserAlert={setOnSearchUserAlert}
            setOnAddAlert={setOnAddAlert}
            setCoManagersInfo={setCoManagersInfo}
          />
        )}
        {onAddAlert && (
          <Alert msg={`관리자가\n추가되었습니다.`} setOnAlert={setOnAddAlert} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CoManager;

const styles = StyleSheet.create({
  mainView: {
    alignItems: "center",
  },
  managerListView: {
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    fontSize: 20,
  },
  coManagerListView: {
    marginTop: 20,
    height: 380,
  },
  itemSeparator: {
    height: 10,
  },

  // 로딩
  loadingView: {
    marginTop: 30,
    alignItems: "center",
  },
});
