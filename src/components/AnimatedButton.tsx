import React, { useState } from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";

type AnimatedButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  loading?: boolean;
  children: React.ReactNode;
};

export function AnimatedButton({
  onPress,
  disabled,
  style,
  textStyle,
  loading,
  children,
}: AnimatedButtonProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={textStyle}>{children}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
