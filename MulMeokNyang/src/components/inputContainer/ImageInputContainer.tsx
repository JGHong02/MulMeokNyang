// Image-picker
import * as ImagePicker from "expo-image-picker";
// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useCallback } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, Image, TouchableOpacity } from "react-native";
// Icon
import Icon from "react-native-vector-icons/FontAwesome";

type ImageInputContainerProps = {
  photoUrl: string;
  setPhotoUrl: Dispatch<SetStateAction<any>>;
};

const ImageInputContainer: FC<ImageInputContainerProps> = ({
  photoUrl,
  setPhotoUrl,
}) => {
  // Default 사진
  const defaultPhoto = require("../../../assets/UserProfileDefaultPhoto.png");

  // 사진 권한 요청 Hook
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = useCallback(async () => {
    // 권한 확인
    try {
      if (!status?.granted) {
        const permission = await requestPermission();
        if (!permission.granted) return null;
      }

      // 사진 업로드
      const result = await ImagePicker.launchImageLibraryAsync({
        // 어떤 타입의 파일을 업로드 할 지
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // 사진 업로드 전, 자르기 등의 추가 편집 여부
        allowsEditing: false,
        // 사진 압축 여부, 1로 설정하면 가장 높은 품질로 파일 업로드
        quality: 1,
        // 사진 비율
        aspect: [1, 1],
      });

      // 사진 업로드 취소한 경우
      if (result.canceled) return null;

      // 사진 업로드 결과 및 사진 경로 업데이트
      console.log(result);
      setPhotoUrl((prevForm: any) => ({
        ...prevForm,
        userProfilePhoto: result.assets[0].uri,
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <View style={[styles.view]}>
      <Image
        source={photoUrl ? { uri: photoUrl } : defaultPhoto}
        style={[styles.image]}
      />
      <TouchableOpacity onPress={pickImage} style={[styles.icon]}>
        <Icon name="camera" size={40} />
        <View style={[styles.iconWhiteBackground]} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageInputContainer;

const styles = StyleSheet.create({
  view: {
    position: "relative",
    marginTop: 40,
    marginBottom: 60,
  },
  image: {
    borderRadius: 100,
    width: 170,
    height: 170,
  },
  icon: {
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  iconWhiteBackground: {
    backgroundColor: "white",
    position: "absolute",
    zIndex: -1,
    right: 1,
    bottom: 3,
    width: 40,
    height: 30,
  },
});
