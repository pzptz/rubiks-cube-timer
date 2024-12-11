import { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { settings } from "@/assets/contexts";

import DropDownPicker from "react-native-dropdown-picker";

export default function CubeTypePicker({ themeChoice }) {
  const [cubeTypeSelectorOpen, setCubeTypeSelectorOpen] = useState(false);
  const setCubeType = useContext(settings).setCubeType;
  const cubeType = useContext(settings).cubeType;
  const cubeOptions = [
    { label: "3x3x3", value: 3 },
    { label: "2x2x2", value: 2 },
    { label: "4x4x4", value: 4 },
    { label: "5x5x5", value: 5 },
  ];
  const handleChange = (item) => {
    setCubeType(item.value);
  };
  return (
    <View style={styles.picker}>
      <DropDownPicker
        open={cubeTypeSelectorOpen}
        value={cubeType}
        items={cubeOptions}
        setOpen={setCubeTypeSelectorOpen}
        onSelectItem={(item) => handleChange(item)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  picker: {
    width: "30%",
  },
});
