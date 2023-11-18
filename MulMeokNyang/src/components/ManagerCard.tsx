// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, Image, Text, TouchableOpacity } from "react-native";
// Icon
import Icon from "react-native-vector-icons/FontAwesome5"; // trash

type ManagerCardProps = {
  isMainManager?: boolean;
  profilePhotoUrl: string;
  nickname: string;
  email: string;
  introduction: string;
  onDeleteButton?: boolean;
  setOnDeleteAlert?: Dispatch<SetStateAction<boolean>>;
  setEmailToDelete?: Dispatch<SetStateAction<string>>;
};

const defaultPhoto = require("../../assets/profileDefaultPhoto/UserProfileDefaultPhoto.png");

const ManagerCard: FC<ManagerCardProps> = ({
  isMainManager = false,
  profilePhotoUrl,
  nickname,
  email,
  introduction,
  onDeleteButton = true,
  setOnDeleteAlert = () => {},
  setEmailToDelete = () => {},
}) => {
  return (
    <View
      style={[
        styles.userProfileView,
        isMainManager ? { height: 160 } : { height: 100 },
      ]}>
      <Image
        source={profilePhotoUrl ? { uri: profilePhotoUrl } : defaultPhoto}
        style={[
          styles.image,
          isMainManager
            ? { width: 120, height: 120 }
            : { width: 80, height: 80 },
        ]}
      />
      <View style={[styles.userProfileTextView]}>
        <Text
          style={
            isMainManager
              ? { fontSize: 18, lineHeight: 30 }
              : { fontSize: 16, lineHeight: 20 }
          }>
          {nickname}
        </Text>
        <Text style={[styles.elseText]}>{email}</Text>
        <Text style={[styles.elseText]}>{introduction}</Text>
      </View>
      {onDeleteButton && (
        <TouchableOpacity
          onPress={() => {
            setOnDeleteAlert(true);
            setEmailToDelete(email);
          }}
          style={[styles.icon]}>
          <Icon name="trash" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ManagerCard;

const styles = StyleSheet.create({
  userProfileView: {
    flexDirection: "row",
    alignItems: "center",
    width: 350,
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 1,
  },
  image: {
    borderRadius: 100,
  },
  userProfileTextView: {
    paddingLeft: 15,
    width: 200,
  },
  elseText: {
    fontSize: 12,
    lineHeight: 20,
    overflow: "scroll",
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});
