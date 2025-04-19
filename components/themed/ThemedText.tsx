import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "semiBold" | "underlineSemiBold" | "subtitle" | "link";
  fontColor?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  fontColor,
  ...rest
}: ThemedTextProps) {
  const color = fontColor ? fontColor : useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "semiBold" ? styles.semiBold : undefined,
        type === "underlineSemiBold" ? styles.underlineSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  semiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  underlineSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textDecorationLine: "underline"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
