import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { sendVerificationCode } from "../utils/sendCode";
import { useCountdown } from "../hooks/useCountdown";
import { isValidPhoneNumber } from "../utils/validation";

import { AnimatedButton } from "../components/AnimatedButton";
import { Message } from "../components/Message";

const COUNTDOWN_SECONDS = 60;

const CodeInputScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [simulatedCode, setSimulatedCode] = useState(
    route.params?.code?.toString() || ""
  );
  const [phone, _] = useState(
    route.params?.phone?.toString() || ""
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { seconds: timer, reset: resetTimer, start: startTimer } =
    useCountdown(COUNTDOWN_SECONDS);

  const handleVerifyCode = () => {
    if (code.length < 4) {
      setError("Введите полный 4-значный код");
      return;
    }
    if (code === simulatedCode) {
      setError("");
      navigation.navigate("Map");
    } else {
      setError("Неверный код. Попробуйте снова.");
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    setInfoMessage("");
    try {
      const newCode = await sendVerificationCode(phone);
      setSimulatedCode(newCode);
      setInfoMessage("Код успешно отправлен");
      setCode("");
      resetTimer();
      startTimer();
    } catch {
      setError("Ошибка при отправке кода. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Подтверждение номера</Text>
      <Text style={styles.label}>Введите 4-значный код из SMS</Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        keyboardType="numeric"
        maxLength={4}
        value={code}
        onChangeText={(text) => {
          if (!isValidPhoneNumber(text)) {
            setCode(text);
            if (error) setError("");
            if (infoMessage) setInfoMessage("");
          }
        }}
        placeholder="— — — —"
        placeholderTextColor="#bbb"
        textContentType="oneTimeCode"
        autoFocus
      />

      {error ? <Message text={error} type="error" /> : null}
      {infoMessage ? <Message text={infoMessage} type="info" /> : null}

      <AnimatedButton
        onPress={handleVerifyCode}
        disabled={code.length < 4 || timer === 0}
        style={[styles.button, (code.length < 4 || timer === 0) && styles.buttonDisabled]}
        textStyle={styles.buttonText}
      >
        Подтвердить
      </AnimatedButton>

      <Text style={styles.timerText}>
        {timer > 0
          ? `Повторная отправка через ${timer} сек.`
          : "Вы можете отправить код повторно"}
      </Text>

      <AnimatedButton
        onPress={handleResendCode}
        disabled={timer > 0 || loading}
        style={[styles.button, (timer > 0 || loading) && styles.buttonDisabled]}
        textStyle={[styles.buttonText, (timer > 0 || loading) && styles.buttonTextDisabled]}
        loading={loading}
      >
        Отправить код заново
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
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontSize: 24,
    letterSpacing: 24,
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#111",
    marginBottom: 8,
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
  timerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});

export default CodeInputScreen;
