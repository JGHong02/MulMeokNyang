// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useState, useCallback } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text, TextInput, Image } from "react-native";
// Custom Component
import ProcessButton from "../button/ProcessButton";
// API
import { userSearch } from "../../api/coManager/userSearch";
import { addCoManager } from "../../api/coManager/addCoManager";
// Icon
import Icon from "react-native-vector-icons/AntDesign"; // search1

// 검색 결과 프로필 사진이 없는 사용자의 경우, defaultPhoto 사용
const defaultPhoto = require("../../../assets/profileDefaultPhoto/UserSearchProfileDefaultPhoto.png");

type SearchUserAlertProps = {
  spaceId: string;
  setOnSearchUserAlert: Dispatch<SetStateAction<boolean>>;
  setOnAddAlert: Dispatch<SetStateAction<boolean>>;
  setCoManagersInfo: Dispatch<SetStateAction<any>>;
};

const SearchUserAlert: FC<SearchUserAlertProps> = ({
  spaceId,
  setOnSearchUserAlert,
  setOnAddAlert,
  setCoManagersInfo,
}) => {
  // 입력한 닉네임 state
  const [searchNickname, setSearchNickname] = useState<string>("");
  // 검색 결과 state
  const [searchResultInfo, setSearchResultInfo] = useState({
    onSearchResult: false,
    profilePhotoUrl: "",
    email: "",
    introduction: "",
  });

  // 1. 입력값 바뀔 때마다 실행될 함수
  const onChangeText = useCallback(
    (inputNickname: string) => {
      setSearchNickname(inputNickname);

      // 검색을 한 뒤 입력값을 바꿀 경우, 검색 결과 지우기
      if (searchResultInfo.onSearchResult) {
        setSearchResultInfo((prev) => ({ ...prev, onSearchResult: false }));
      }
    },
    [searchResultInfo]
  );

  // 2. 검색 아이콘 눌렀을 때 실행될 함수
  const searchPressHandler = useCallback(async () => {
    try {
      const res = await userSearch(searchNickname);

      // 검색 결과가 없는 경우
      if (res.hasOwnProperty("searchResultExists")) return;

      // 검색 결과가 있는 경우
      setSearchResultInfo({
        onSearchResult: true,
        profilePhotoUrl: res.userProfilePhotoUrl,
        email: res.userEmail,
        introduction: res.userIntroduction,
      });
    } catch (error: any) {
      console.log(
        "SearchUserAlert의 userSearch 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }
  }, [searchNickname]);

  // ####################################가짜 검색 함수###############################3
  const fakeSearchPressHandler = useCallback(() => {
    setSearchResultInfo({
      onSearchResult: true,
      profilePhotoUrl: "",
      // "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540chansolchoi%252Fmulmeoknyang/ImagePicker/00a0b1b7-67e4-49a5-9846-c71ccc0d58bf.jpeg",
      email: "sample@example.com",
      introduction: "하하~ 방가방가",
    });
  }, []);

  // 3. '추가' 버튼을 눌렀을 때 실행될 함수
  const addButtonPressHandler = useCallback(async () => {
    try {
      await addCoManager(spaceId, searchNickname);

      // coManagersInfo에 추가한 관리자 정보 추가
      setCoManagersInfo((prev: any) => [
        ...prev,
        {
          profilePhotoUrl: searchResultInfo.profilePhotoUrl,
          nickname: searchNickname,
          email: searchResultInfo.email,
          introduction: searchResultInfo.introduction,
        },
      ]);

      // SearchUserAlert 닫기
      setOnSearchUserAlert(false);

      // AddAlert 띄우기
      setOnAddAlert(true);
    } catch (error: any) {
      console.log(
        "SearchUserAlert의 addCoManager 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }
  }, [searchResultInfo, searchNickname]);

  // ####################################가짜 추가 함수###############################3
  const fakeAddButtonPressHandler = useCallback(() => {
    setCoManagersInfo((prev: any) => [
      ...prev,
      {
        profilePhotoUrl:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540chansolchoi%252Fmulmeoknyang/ImagePicker/00a0b1b7-67e4-49a5-9846-c71ccc0d58bf.jpeg",
        nickname: searchNickname,
        email: "added88@google.com",
        introduction: "방금 추가됐지롱 ~ ^^",
      },
    ]);
    setOnSearchUserAlert(false);
    setOnAddAlert(true);
  }, [searchNickname]);

  return (
    <View style={[styles.alertView]}>
      <TouchableOpacity
        onPress={() => setOnSearchUserAlert(false)}
        style={[styles.closeIcon]}>
        <Icon name="close" size={35} color="#343434" />
      </TouchableOpacity>
      <View style={[styles.titleTextView]}>
        <Text style={[styles.titleText]}>
          {`추가할 관리자의\n닉네임을 입력해주세요.`}
        </Text>
      </View>
      <View style={[styles.subTextView]}>
        <Text style={[styles.subText]}>
          {`이미 등록된 관리자 혹은\n다른 관리 스페이스의 사용자는\n검색되지 않습니다.`}
        </Text>
      </View>
      <View style={[styles.searchView]}>
        <View style={[styles.inputView]}>
          <TextInput style={[styles.input]} onChangeText={onChangeText} />
          {/* <TouchableOpacity onPress={searchPressHandler}> */}
          <TouchableOpacity onPress={fakeSearchPressHandler}>
            <Icon name="search1" size={30} color="#343434" />
          </TouchableOpacity>
        </View>
        {searchResultInfo.onSearchResult && (
          <View style={[styles.searchResultView]}>
            <Image
              source={
                searchResultInfo.profilePhotoUrl
                  ? { uri: searchResultInfo.profilePhotoUrl }
                  : defaultPhoto
              }
              style={[styles.image]}
            />
            <View>
              <Text style={[styles.nicknameText]}>{searchNickname}</Text>
              <Text>{searchResultInfo.email}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={[styles.buttonView]}>
        <ProcessButton
          content="추가"
          canPress
          // onPressHandler={addButtonPressHandler}
          onPressHandler={fakeAddButtonPressHandler}
          isInAlert
        />
      </View>
    </View>
  );
};

export default SearchUserAlert;

const styles = StyleSheet.create({
  alertView: {
    position: "relative",
    width: 352,
    height: 420,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  titleTextView: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  titleText: {
    fontSize: 20,
  },
  subTextView: {
    position: "absolute",
    top: 110,
    left: 20,
  },
  subText: {
    fontSize: 12,
    color: "#474747",
  },

  // 검색창
  searchView: {
    position: "absolute",
    top: 180,
    left: 20,
    width: 312,
  },
  inputView: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  input: {
    width: 270,
    height: 40,
    paddingLeft: 10,
    fontSize: 20,
  },

  // 검색 결과
  searchResultView: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    backgroundColor: "#cecece",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    margin: 5,
  },
  nicknameText: {
    fontWeight: "600",
  },

  // 버튼
  buttonView: {
    position: "absolute",
    bottom: 0,
  },
});
