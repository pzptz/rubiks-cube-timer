import { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { settings } from "@/assets/contexts";
import DropDownPicker from "react-native-dropdown-picker";
import Theme from "@/assets/theme";

export default function CubeTypePicker({ themeChoice, handleChange }) {
  const [cubeTypeSelectorOpen, setCubeTypeSelectorOpen] = useState(false);
  const setCubeType = useContext(settings).setCubeType;
  const cubeType = useContext(settings).cubeType;
  const cubeOptions = [
    { label: "3x3x3", value: 3 },
    { label: "2x2x2", value: 2 },
    { label: "4x4x4", value: 4 },
    { label: "5x5x5", value: 5 },
  ];
  return (
    <View style={styles.picker}>
      <DropDownPicker
        style={{
          borderWidth: 0,
          backgroundColor: Theme[themeChoice].flair,
        }}
        textStyle={{
          color: Theme[themeChoice].textPrimary,
          fontSize: 16,
          fontWeight: "bold",
        }}
        dropDownContainerStyle={{
          backgroundColor: Theme[themeChoice].dropDownBackground,
        }}
        open={cubeTypeSelectorOpen}
        value={cubeType}
        items={cubeOptions}
        setOpen={setCubeTypeSelectorOpen}
        onSelectItem={(item) => handleChange(item.value)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  picker: {
    width: "30%",
  },
});
