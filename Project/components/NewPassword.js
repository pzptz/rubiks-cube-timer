// components/ChangePasswordModal.js

import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import Theme from "@/assets/theme";
import db from "@/database/db";
import { settings, loadingContext } from "@/assets/contexts";

const ChangePasswordModal = ({ isVisible, onClose }) => {
  const themeChoice = useContext(settings).themeChoice;
  const setLoading = useContext(loadingContext).setLoading;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async () => {
    // Input Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Re-authenticate the user if necessary
      // Depending on your auth setup, you might need to handle re-authentication here

      // Update password
      const { error } = await db.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Password changed successfully.");
      // Reset form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Close the modal
      onClose();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message || "Failed to change password.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalOverlay,
          { backgroundColor: Theme[themeChoice].backgroundPrimary },
        ]}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: Theme[themeChoice].dropDownBackground },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: Theme[themeChoice].textPrimary },
            ]}
          >
            Change Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Theme[themeChoice].textSecondary,
                color: Theme[themeChoice].textPrimary,
                backgroundColor: Theme[themeChoice].inputBackground,
              },
            ]}
            placeholder="Current Password"
            placeholderTextColor={Theme[themeChoice].textSecondary}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Theme[themeChoice].textSecondary,
                color: Theme[themeChoice].textPrimary,
                backgroundColor: Theme[themeChoice].inputBackground,
              },
            ]}
            placeholder="New Password"
            placeholderTextColor={Theme[themeChoice].textSecondary}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Theme[themeChoice].textSecondary,
                color: Theme[themeChoice].textPrimary,
                backgroundColor: Theme[themeChoice].inputBackground,
              },
            ]}
            placeholder="Confirm New Password"
            placeholderTextColor={Theme[themeChoice].textSecondary}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: Theme[themeChoice].flair },
              ]}
              onPress={handleChangePassword}
              disabled={isSubmitting}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: Theme[themeChoice].backgroundPrimary },
                ]}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: Theme[themeChoice].backgroundPrimary },
              ]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text
                style={[styles.buttonText, { color: Theme[themeChoice].flair }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChangePasswordModal;
