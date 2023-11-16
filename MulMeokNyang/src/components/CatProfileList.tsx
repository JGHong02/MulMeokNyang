// FC Type
import type { FC } from "react";
// Context
import { CatContext } from "../contexts/CatContext";
// Hook
import { useEffect, useContext, useCallback } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { FlatList, TouchableOpacity, View, Image, Text } from "react-native";

type CatProfileListProps = {
  idArr: string[];
  photoUrlArr: string[];
};

const CatProfileList: FC<CatProfileListProps> = ({ idArr, photoUrlArr }) => {
  // 사진 눌렀을 때, currentSelectedCatId를 변경하고 style을 바꾸기 위해 전역 변수와 setter 함수 불러오기
  const { currentSelectedCatIdGV, setCurrentSelectedCatIdGV } =
    useContext(CatContext);

  // FlatList의 item으로 사용할 listData 생성
  // listData: [{id: 1, photoUrl: url1}, {id: 2, photoUrl: url2}, ...]
  let listData = [];
  for (let i = 0; i < idArr.length; i++) {
    const data = { id: idArr[i], photoUrl: photoUrlArr[i] };
    listData.push(data);
  }

  // 사진이 등록되지 않은 경우, 기본 사진 사용
  const defaultPhoto = require("../../assets/profileDefaultPhoto/CatProfileDefaultPhoto.png");

  // 사진 눌렀을 때, currentSelectedCatId 변경하는 이벤트 핸들러 함수
  const changeCurrentCat = useCallback((id: string) => {
    setCurrentSelectedCatIdGV(id);
  }, []);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={listData}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => changeCurrentCat(item.id)}
          style={[styles.item]}>
          <View
            style={[
              styles.imageBorder,
              item.id === currentSelectedCatIdGV
                ? styles.imageBorderGreen
                : styles.imageBorderGrey,
            ]}>
            <Image
              source={item.photoUrl ? { uri: item.photoUrl } : defaultPhoto}
              style={[styles.image]}
            />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={[styles.itemSeparator]} />}
    />
  );
};

export default CatProfileList;

const styles = StyleSheet.create({
  item: {
    position: "relative",
    width: 60,
    height: 60,
  },
  imageBorder: {
    position: "absolute",
    borderRadius: 100,
    width: 60,
    height: 60,
    zIndex: -1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBorderGreen: {
    backgroundColor: "#00843d",
  },
  imageBorderGrey: {
    backgroundColor: "#c6c3bd",
  },
  image: {
    position: "absolute",
    borderRadius: 100,
    width: 54,
    height: 54,
  },
  itemSeparator: {
    width: 15,
  },
});
