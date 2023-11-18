// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useCallback } from "react";
// CustomHook
import { useGoRoute, useGoRouteWithParams } from "../../hooks/useGoScreen";
// Dimensions, StyleSheet, Component
import { Dimensions, StyleSheet } from "react-native";
import { View, Image, TouchableOpacity, Text } from "react-native";
// Custom Component
import DrawerRoute from "./DrawerRotue";
import SubDrawerRoute from "./SubDrawerRoute";
// API
import { logout } from "../../api/drawer/logout";
// Icon
import ETIcon from "react-native-vector-icons/Entypo";
import ADIcon from "react-native-vector-icons/AntDesign";

const { height } = Dimensions.get("window");

type DrawerProps = {
  userEmail: string;
  userProfile: any;
  closeDrawer: Dispatch<SetStateAction<boolean>>;
  setAlertInfo: Dispatch<SetStateAction<any>>;
};

const Drawer: FC<DrawerProps> = ({
  userEmail,
  userProfile,
  closeDrawer,
  setAlertInfo,
}) => {
  // 사진이 등록되지 않았을 경우, 기본 사진 사용
  const defaultPhoto = require("../../../assets/profileDefaultPhoto/UserProfileDefaultPhoto.png");

  // 1. '사용자 프로필 수정' 클릭 시, 화면 이동 함수
  const goUserProfileModification = useGoRouteWithParams(
    "UserProfileModification",
    "prevUserProfile",
    userProfile
  );

  // 2. '고양이 프로필 추가' 클릭 시, 화면 이동 함수
  const goCatProfileRegistration = useGoRouteWithParams(
    "CatProfileRegistration",
    "method",
    "추가 등록"
  );

  // 3. '고양이 프로필 수정' 하위 '프로필/습식 사료/음수량' 클릭 시, Alert 띄우기
  const showSelectCatAlertToModify = useCallback(
    (typeOfInfo: string, route: string) => {
      setAlertInfo({
        onSelectCatAlert: true,
        typeOfInfo: typeOfInfo,
        typeOfAction: "수정",
        route: route,
      });
    },
    []
  );

  // 4. '고양이 프로필 삭제' 클릭 시, Alert 띄우기
  const showSelectCatAlertToDelete = useCallback(() => {
    setAlertInfo({
      onSelectCatAlert: true,
      typeOfInfo: "",
      typeOfAction: "삭제",
      route: "Main",
    });
  }, []);

  // 5. '공동 관리자 관리' 클릭 시, 화면 이동 함수
  const goCoManagerManagement = useGoRoute("CoManagerManagement");

  // 6. '로그아웃' 클릭 시, 로그아웃 처리한 뒤 Start 화면으로 이동
  const goStart = useGoRoute("Start");
  const logoutAndGoStart = useCallback(async () => {
    try {
      await logout(userEmail);
      goStart();
    } catch (error: any) {
      console.log("Drawer의 logout 호출에서 error 발생 :", error.message);
      throw error;
    }
  }, []);

  return (
    <View style={[styles.drawerView]}>
      <View style={[styles.topBar]}>
        <TouchableOpacity onPress={() => closeDrawer(false)}>
          <ETIcon name="chevron-thin-right" size={30} color="#343434" />
        </TouchableOpacity>
      </View>
      <View style={[styles.userProfileView, styles.borderBottomLine]}>
        <Image
          source={
            userProfile.profilePhoroUrl
              ? { uri: userProfile.profilePhoroUrl }
              : defaultPhoto
          }
          style={[styles.image]}
        />
        <View style={[styles.userProfileTextView]}>
          <Text style={[styles.nicknameText]}>{userProfile.nickname}</Text>
          {/* <Text style={[styles.elseText]}>{userEmail}</Text> */}
          <Text style={[styles.elseText]}>hjk9216@naver.com</Text>
          <Text style={[styles.elseText]}>{userProfile.introduction}</Text>
        </View>
      </View>
      <DrawerRoute
        name="사용자 프로필 수정"
        onPressHandler={goUserProfileModification}
      />
      <DrawerRoute
        name="고양이 프로필 추가"
        onPressHandler={goCatProfileRegistration}
      />
      <View style={[styles.routeButtonView, styles.borderBottomLine]}>
        <Text style={[styles.routeText]}>고양이 프로필 수정</Text>
      </View>
      <View style={[styles.subRouteButtonView, styles.borderBottomLine]}>
        {[
          { name: "프로필", route: "CatProfileModification" },
          { name: "습식 사료", route: "CatFeedStuffModification" },
          { name: "음수량", route: "CatHydrationModification" },
        ].map((value, index) => (
          <SubDrawerRoute
            key={index}
            name={value.name}
            onPressHandler={() =>
              showSelectCatAlertToModify(value.name, value.route)
            }
          />
        ))}
      </View>
      <DrawerRoute
        name="고양이 프로필 삭제"
        onPressHandler={showSelectCatAlertToDelete}
      />
      <DrawerRoute
        name="공동 관리자 관리"
        onPressHandler={goCoManagerManagement}
      />
      <TouchableOpacity style={[styles.logoutView]} onPress={logoutAndGoStart}>
        <Text style={[styles.routeText]}>로그아웃</Text>
        <ADIcon name="logout" size={25} />
      </TouchableOpacity>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  drawerView: {
    width: 330,
    height: height,
    borderLeftWidth: 1,
    borderLeftColor: "#a3a3a3",
    backgroundColor: "white",
  },
  borderBottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#a3a3a3",
  },
  topBar: {
    marginTop: 40,
    paddingLeft: 10,
    height: 45,
  },
  userProfileView: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingBottom: 20,
  },
  image: {
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  userProfileTextView: {
    paddingLeft: 15,
    width: 200,
  },
  nicknameText: {
    fontSize: 18,
    lineHeight: 30,
  },
  elseText: {
    fontSize: 12,
    lineHeight: 20,
    overflow: "scroll",
  },

  // 라우터
  routeButtonView: {
    width: 330,
    height: 50,
    paddingLeft: 30,
    justifyContent: "center",
  },
  routeText: {
    fontSize: 17,
  },
  subRouteButtonView: {
    height: 130,
    justifyContent: "center",
  },

  // 로그아웃
  logoutView: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
