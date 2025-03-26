import React from "react";
import { Text, TextProps } from "react-native";

export const CustomText: React.FC<TextProps> = ({
  style,
  className,
  ...props
}) => {
  return (
    <Text
      style={[{ fontFamily: "FiraCode" }, style]}
      className={`font-fira-code ${className}`}
      {...props}
    />
  );
};
