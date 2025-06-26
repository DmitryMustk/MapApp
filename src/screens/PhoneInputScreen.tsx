import { useState } from "react";
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

import { TextInputMask } from "react-native-masked-text";

import { sendVerificationCode } from "../utils/sendCode";
import { isValidPhoneNumber } from "../utils/validation";

import { AnimatedButton } from "../components/AnimatedButton";
import { Message } from "../components/Message";

const PhoneInputScreen = ({ navigation }: { navigation: any }) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendPhone = async () => {
    setError("");
    if (!isValidPhoneNumber(phone)) {
      setError("Введите корректный номер телефона");
      return;
    }
    setLoading(true);
    try {
      const code = await sendVerificationCode(phone);
      setLoading(false);
      navigation.navigate("CodeInput", { code, phone });
    } catch (e) {
      setLoading(false);
      setError("Ошибка отправки номера. Попробуйте позже.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Введите номер телефона</Text>

      <View style={styles.inputContainer}>
        <TextInputMask
          type={"custom"}
          options={{
            mask: "+7 (999) 999-99-99",
          }}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (error) setError("");
          }}
          style={[styles.input, error ? styles.inputError : null]}
          keyboardType="phone-pad"
          placeholder="+7 (___) ___-__-__"
          maxLength={18}
          autoFocus
          returnKeyType="done"
        />
      </View>

      {error ? <Message text={error} type="error" /> : null}

      <AnimatedButton
        onPress={handleSendPhone}
        disabled={!isValidPhoneNumber(phone) || loading}
        style={[
          styles.button,
          (!isValidPhoneNumber(phone) || loading) && styles.buttonDisabled,
        ]}
        textStyle={[
          styles.buttonText,
          (!isValidPhoneNumber(phone) || loading) && styles.buttonTextDisabled,
        ]}
        loading={loading}
      >
        Отправить код
      </AnimatedButton>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: "#fff",
    color: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonTextDisabled: {
    color: "#ccc",
  },
});

export default PhoneInputScreen;
