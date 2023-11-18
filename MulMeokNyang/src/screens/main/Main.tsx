// Context
import { UserContext } from "../../contexts/UserContext";
import { CatContext } from "../../contexts/CatContext";
// Hook
import { useEffect, useContext, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import CatProfileList from "../../components/CatProfileList";
import ProcessButton from "../../components/button/ProcessButton";
import SelectCatAlert from "../../components/alert/SelectCatAlert";
import Drawer from "../../components/drawer/Drawer";
// API
import { getCatProfileList } from "../../api/main/getCatProfileList";
import { getCatMainInfo } from "../../api/main/getCatMainInfo";
import { getUserProfile } from "../../api/common/getUserProfile";
// styles
import mainViewStyles from "../../styles/mainViewStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";
// Icon
import Icon from "react-native-vector-icons/Ionicons";

const Main = () => {
  // #############################가짜 메인 데이터#############################
  const fakeMainData = [
    { name: "카게야마", age: "17", weight: "70", hydrationGuage: 47 },
    { name: "히나타", age: "17", weight: "50", hydrationGuage: 29 },
    { name: "츠키시마", age: "17", weight: "75", hydrationGuage: 98 },
    { name: "야마구치", age: "17", weight: "70", hydrationGuage: 90 },
    { name: "스가", age: "19", weight: "65", hydrationGuage: 76 },
    { name: "아사히", age: "19", weight: "80", hydrationGuage: 110 },
    { name: "니시노야", age: "18", weight: "50", hydrationGuage: 130 },
    { name: "타나카", age: "18", weight: "70", hydrationGuage: 180 },
  ];

  // 관리 스페이스의 메인 데이터를 불러오고 저장하기 위한 전역변수, setter 함수 불러오기
  const { userEmailGV, managementSpaceIdGV } = useContext(UserContext);
  const {
    catIdArrGV,
    setCatIdArrGV,
    catProfilePhotoUrlArrGV,
    setCatProfilePhotoUrlArrGV,
  } = useContext(CatContext);

  // 현재 선택된 고양이의 메인 정보 state
  const [currentSelectedCatId, setCurrentSelectedCatId] =
    useState<string>("kage");
  // const [currentSelectedCatPhotoUrl, setCurrentSelectedCatPhotoUrl] =
  //   useState<string>("");
  // const [catName, setCatName] = useState<string>("");
  // const [catAge, setCatAge] = useState<string>("");
  // const [catWeight, setCatWeight] = useState<string>("");
  // const [hydrationGuage, setHydrationGuage] = useState<number>(0);
  // const [hydrationGuageColor, setHydrationGuageColor] = useState<string>("");

  // Drawer 여닫기 State
  const [onDrawer, setOnDrawer] = useState<boolean>(false);
  // Drawer과 '사용자 프로필 수정'에서 사용할 사용자 프로필 정보 state
  const [userProfile, setUserProfile] = useState({
    profilePhotoUrl: "",
    nickname: "",
    introduction: "",
  });
  // Drawer에서 고양이 프로필 수정 or 삭제 클릭 시 뜨는 alert 관련 state
  const [selectCatAlertInfo, setSelectCatAlertInfo] = useState({
    onSelectCatAlert: false,
    typeOfInfo: "",
    typeOfAction: "",
    route: "",
  });

  // #################################API 연동되면 지워#################################
  const [currentSelectedCatPhotoUrl, setCurrentSelectedCatPhotoUrl] =
    useState<string>(
      catProfilePhotoUrlArrGV[catIdArrGV.indexOf(currentSelectedCatId)]
    );
  // 현재 선택된 고양이의 메인 정보 state
  const [catName, setCatName] = useState<string>(
    fakeMainData[catIdArrGV.indexOf(currentSelectedCatId)].name
  );
  const [catAge, setCatAge] = useState<string>(
    fakeMainData[catIdArrGV.indexOf(currentSelectedCatId)].age
  );
  const [catWeight, setCatWeight] = useState<string>(
    fakeMainData[catIdArrGV.indexOf(currentSelectedCatId)].weight
  );
  const [hydrationGuage, setHydrationGuage] = useState<number>(
    fakeMainData[catIdArrGV.indexOf(currentSelectedCatId)].hydrationGuage
  );
  const [hydrationGuageColor, setHydrationGuageColor] = useState<string>("");
  const [evaluation, setEvaluation] = useState<string>("");
  // #############################여기까지 지울 코드####################################

  // 1. 마운트 시, 해당 관리 스페이스에서 관리하는 고양이의 Id와 프로필 사진 리스트 불러오기
  // 또한, Drawer을 열었을 때 보이는 사용자 프로필 정보와
  // Drawer에서 '사용자 프로필 수정' 버튼을 눌렀을 때 기존 정보를 전달하기 위해
  // 사용자 프로필 정보도 불러오기

  // goBack으로 Main 화면에 돌아올 때마다 리렌더링
  const isFocused = useIsFocused();

  useEffect(() => {
    // useEffect에서는 async, await를 직접 쓸 수 없기 때문에
    // async 함수를 선언하고 호출해야 함.

    // 고양이의 Id와 프로필 사진 리스트 불러올 함수
    const setCatProfileListInfo = async () => {
      try {
        const res = await getCatProfileList(managementSpaceIdGV);
        // 다른 화면에서도 사용하기 위해 전역 변수로 관리
        setCatIdArrGV(res.catIdArr);
        setCatProfilePhotoUrlArrGV(res.catProfilePhotoUrlArr);
        setCurrentSelectedCatId(res.catIdArr[0]);
      } catch (error: any) {
        console.log(
          "Main 화면 getCatProfileList 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    // 사용자 프로필 정보 불러올 함수
    const setUserProfileInfo = async () => {
      try {
        const res = await getUserProfile(userEmailGV);
        setUserProfile({
          profilePhotoUrl: res.userProfilePhotoUrl,
          nickname: res.userNickname,
          introduction: res.userIntroduction,
        });
      } catch (error: any) {
        console.log(
          "Main 화면 getUserProfile 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    // setCatProfileListInfo();
    // setUserProfileInfo();

    // ######################가짜 데이터#########################
    setUserProfile({
      profilePhotoUrl: "",
      nickname: "무적코털슝슝",
      introduction: "안녕? 반갑다. 잘 지내보자.",
    });
  }, [isFocused]);

  // 2. currentSelectedCatIdGV 값이 바뀔 때마다,
  // currentSelectedCatPhotoUrl state 값 바꿔서 MainView에 띄울 고양이 프로필 사진 바꾸고,
  // 해당 고양이의 mainInfo 불러와 데이터 바인딩
  useEffect(() => {
    // currentSelectedCatId가 catIdArrGV에서 몇 번째 index에 위치해 있는 지를 저장할 변수
    const currentArrIdx = catIdArrGV.indexOf(currentSelectedCatId);
    // currentSelectedCatPhotoUrl 바꾸기
    setCurrentSelectedCatPhotoUrl(catProfilePhotoUrlArrGV[currentArrIdx]);

    // ##################################여기부터 진짜 코드#####################################
    const setCatMainInfo = async () => {
      try {
        const res = await getCatMainInfo(
          currentSelectedCatId,
          managementSpaceIdGV
        );
        setCatName(res.catName);
        setCatAge(res.catAge);
        setCatWeight(res.catWeight);
        setHydrationGuage(res.hydrationGuage);
      } catch (error: any) {
        console.log(
          "Main 화면 getCatMainInfo 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    // setCatMainInfo();
    // ################################여기까지 진짜 코드#######################################

    // ################################API 연결 후 아래 코드 삭제################################
    setCatName(fakeMainData[currentArrIdx].name);
    setCatAge(fakeMainData[currentArrIdx].age);
    setCatWeight(fakeMainData[currentArrIdx].weight);
    setHydrationGuage(fakeMainData[currentArrIdx].hydrationGuage);
  }, [currentSelectedCatId]);

  // 사진이 등록되지 않았을 경우, 기본 사진 사용
  const defaultPhoto = require("../../../assets/profileDefaultPhoto/CatProfileDefaultPhoto.png");

  // 3. hydrationGuage 값에 따라 guage 색상과 평가글 다르게 저장
  useEffect(() => {
    let color = "";
    let evaluation = "";

    if (hydrationGuage < 30) {
      color = "#d20000cc";
      evaluation = `너무 조금 마시고 있어요.\n물주기 버튼을 통해 음수량을 늘려주세요!`;
    } else if (hydrationGuage < 60) {
      color = "#fcc21bcc";
      evaluation = `아직 충분한 물을 마시지 못 했어요.\n물주기 버튼을 통해 음수량을 늘려주세요!`;
    } else if (hydrationGuage < 90) {
      color = "#00843dcc";
      evaluation = `나쁘지 않은 음수량이에요.\n물주기 버튼을 통해 목표량을 채워볼까요?`;
    } else if (hydrationGuage < 150) {
      color = "#004aadcc";
      evaluation = `오늘 충분한 물을 마셨네요!\n열심히 물을 마셔준 고양이님께 감사를..`;
    } else {
      color = "#d20000cc";
      evaluation = `음수량이 너무 많아요!\n고양이에게 이상이 생겼을 수도 있어요.\n빠른 시일 내에 병원에 가보시는 게 좋겠어요.`;
    }
    setHydrationGuageColor(color);
    setEvaluation(evaluation);
  }, [hydrationGuage]);

  return (
    <SafeAreaView>
      <View pointerEvents={onDrawer ? "none" : "auto"}>
        <TopBar back={false} title="물먹냥" drawer openDrawer={setOnDrawer} />
        <View style={[styles.catProfileListView]}>
          <CatProfileList
            idArr={catIdArrGV}
            photoUrlArr={catProfilePhotoUrlArrGV}
            currentSelectedCatId={currentSelectedCatId}
            setCurrentSelectedCatId={setCurrentSelectedCatId}
          />
        </View>
        <View style={[mainViewStyles.mainView]}>
          <View style={[styles.basicInfoAndButtonView]}>
            <Image
              source={
                currentSelectedCatPhotoUrl
                  ? { uri: currentSelectedCatPhotoUrl }
                  : defaultPhoto
              }
              style={[styles.image]}
            />
            <View style={[styles.basicInfoTextView]}>
              <Text style={[styles.nameText]}>{catName}</Text>
              <Text style={[styles.ageAndWeightText]}>
                {catAge}살 / {catWeight}kg
              </Text>
            </View>
            <TouchableOpacity>
              <View style={[styles.button]}>
                <Icon name="water" size={50} color="#004aad" />
                <Text style={[styles.buttonText]}>물주기</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.guageView]}>
            <View style={[styles.leftGuageBar]}>
              {[0, 30, 60, 90, 100].map((value, index) => (
                <View
                  style={[
                    styles.guageTextView,
                    { left: value * 2 - 15 },
                    value === 100 ? { top: -20 } : { bottom: -20 },
                  ]}
                  key={index}>
                  <Text style={[styles.guageText]}>{value}%</Text>
                </View>
              ))}
              <View
                style={[
                  styles.hydrationGuage,
                  hydrationGuage <= 100
                    ? { width: hydrationGuage * 2 }
                    : { width: 200 },
                  { backgroundColor: hydrationGuageColor },
                ]}
              />
            </View>
            <View style={[styles.rightGuageBar]}>
              {[150, 200].map((value, index) => (
                <View
                  style={[
                    styles.guageTextView,
                    { left: (value - 100) * 1.4 - 15, bottom: -20 },
                  ]}
                  key={index}>
                  <Text style={[styles.guageText]}>{value}%</Text>
                </View>
              ))}
              <View
                style={[
                  styles.hydrationGuage,
                  hydrationGuage > 100 && {
                    width: (hydrationGuage - 100) * 1.4,
                  },
                  { backgroundColor: hydrationGuageColor },
                ]}
              />
            </View>
          </View>
          <View style={[styles.evaluationView]}>
            <Text style={[styles.evaluationText]}>{evaluation}</Text>
          </View>
          <View style={[styles.buttonView]}>
            <ProcessButton
              content="기간별 음수량 통계 보기"
              canPress
              route="HydrationStatistics"
            />
          </View>
        </View>
      </View>
      {onDrawer && (
        <View style={[styles.drawerView]}>
          <Drawer
            userEmail={userEmailGV}
            userProfile={userProfile}
            closeDrawer={setOnDrawer}
            setAlertInfo={setSelectCatAlertInfo}
          />
        </View>
      )}
      {selectCatAlertInfo.onSelectCatAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <SelectCatAlert
            setAlertInfo={setSelectCatAlertInfo}
            // state로
            typeOfInfo={selectCatAlertInfo.typeOfInfo}
            typeOfAction={selectCatAlertInfo.typeOfAction}
            idArr={catIdArrGV}
            photoUrlArr={catProfilePhotoUrlArrGV}
            // state로
            route={selectCatAlertInfo.route}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  catProfileListView: {
    width: 400,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },

  // 기본 정보와 물 주기 버튼
  basicInfoAndButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 340,
    height: 150,
    marginBottom: 30,
  },
  image: {
    borderRadius: 100,
    width: 130,
    height: 130,
  },
  basicInfoTextView: {
    margin: 20,
    width: 100,
  },
  nameText: {
    fontSize: 20,
    lineHeight: 40,
  },
  ageAndWeightText: {
    fontSize: 15,
    lineHeight: 40,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: 100,
    backgroundColor: "#59a0ff",
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },

  // 게이지
  guageView: {
    flexDirection: "row",
    width: 340,
    height: 70,
    borderWidth: 1,
    marginBottom: 50,
  },
  leftGuageBar: {
    position: "relative",
    width: 200,
    borderRightWidth: 1,
    borderRightColor: "#a3a3a3",
  },
  rightGuageBar: {
    position: "relative",
    width: 140,
  },
  guageTextView: {
    position: "absolute",
    width: 34,
    alignItems: "center",
  },
  guageText: {
    fontSize: 12,
  },
  hydrationGuage: {
    height: 68,
    position: "absolute",
    left: 0,
    backgroundColor: "#d20000cc",
  },

  // 평가
  evaluationView: {
    width: 340,
    height: 130,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    justifyContent: "center",
  },
  evaluationText: {
    fontSize: 15,
  },

  // 버튼
  buttonView: {
    position: "absolute",
    bottom: 250,
  },

  // 드로어
  drawerView: {
    position: "absolute",
    right: 0,
  },
});
