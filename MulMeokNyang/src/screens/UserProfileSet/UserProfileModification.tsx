// FC Type
import type { FC } from "react";
// Custom Component
import UserProfileSet from "./UserProfileSet";

type UserProfileModificationType = {
  route: any;
};

const UserProfileModification: FC<UserProfileModificationType> = ({
  route,
}) => {
  const { prevUserProfile } = route.params;
  console.log(prevUserProfile);

  return (
    <>
      <UserProfileSet method="수정" prevUserProfile={prevUserProfile} />
    </>
  );
};

export default UserProfileModification;
