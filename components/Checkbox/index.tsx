import React from "react";
import { Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CheckBoxProps {
  isChecked: boolean;
  onPress: () => void;
}

//Implement white checkbox on dark mode and black checkbox on light mode, always black/grey on android
const Checkbox = (props: CheckBoxProps) => {
  const { onPress, isChecked } = props;
  const name = isChecked ? "checkbox-blank-circle" : "checkbox-blank-circle-outline";
  return (
    <Pressable onPress={onPress}>
      <MaterialCommunityIcons name={name} size={40} color="blue" />
    </Pressable>
  );
};

export default Checkbox;
