import React from "react";
import { Text, StyleSheet } from "react-native";

type MessageProps = {
  text: string;
  type: "error" | "info";
};

export function Message({ text, type }: MessageProps) {
  return (
    <Text style={type === "error" ? styles.errorText : styles.infoText}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  infoText: {
    color: "green",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
