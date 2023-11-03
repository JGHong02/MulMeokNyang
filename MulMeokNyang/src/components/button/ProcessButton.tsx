// FC Type
import type { FC } from "react";
// Hook
import { useCallback } from "react";
// Custom Hook
import useGoRoute from "../../hooks/useGoRoute";
// Component
import { TouchableOpacity } from "react-native";
// Custom Component
import ButtonUI from "./ButtonUI";

type ProcessButtonProps = {
  content: string;
  canPress: boolean;
  onPressHandler?: () => void;
  route?: string;
  isInAlert?: boolean;
  halfSize?: boolean;
};

const ProcessButton: FC<ProcessButtonProps> = ({
  content,
  canPress,
  onPressHandler = () => {},
  route = "",
  isInAlert = false,
  halfSize = false,
}) => {
  // 이벤트 핸들러 함수 안에 훅 함수를 직접 쓸 수 없음
  // 따라서 goRoute 변수에 저장을 하고 이를 호출해야 함
  const goRoute = useGoRoute(route);
  const onPress = useCallback(() => {
    onPressHandler();
    if (!route) return;
    goRoute(); // useGoRoute(route)를 바로 사용하면 훅 중첩 에러가 뜸
  }, [onPressHandler, route]);

  return (
    <TouchableOpacity disabled={!canPress} onPress={onPress}>
      <ButtonUI
        content={content}
        canPress={canPress}
        isInAlert={isInAlert}
        halfSize={halfSize}
      />
    </TouchableOpacity>
  );
};

export default ProcessButton;
