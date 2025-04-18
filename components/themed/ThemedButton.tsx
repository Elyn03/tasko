import { TouchableOpacity, StyleSheet, type TouchableOpacityProps, type TextStyle } from 'react-native';
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/themed/ThemedText";

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  type?: "default" | "secondary" | "link";
  textStyle?: TextStyle;
  title: string;
};

export function ThemedButton({
                               style,
                               lightColor,
                               darkColor,
                               lightBackgroundColor,
                               darkBackgroundColor,
                               type = 'default',
                               textStyle,
                               onPress,
                               title,
                               disabled,
                               ...rest
                             }: ThemedButtonProps) {
  return (
      <TouchableOpacity
          style={[
            styles.button,
            type === 'default' ? styles.defaultButton : undefined,
            type === 'secondary' ? styles.secondaryButton : undefined,
            type === 'link' ? styles.linkButton : undefined,
            disabled && styles.disabled,
            style,
          ]}
          onPress={onPress}
          disabled={disabled}
          {...rest}
      >
        <ThemedText
            style={[
              styles.text,
              type === 'default' ? styles.defaultText : undefined,
              type === 'secondary' ? styles.secondaryText : undefined,
              type === 'link' ? styles.linkText : undefined,
              disabled && styles.disabledText,
              textStyle,
            ]}
        >
          {title}
        </ThemedText>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultButton: {
    backgroundColor: Colors.darkTeal,
  },
  secondaryButton: {
    backgroundColor: Colors.salmon,
  },
  linkButton: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  defaultText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#333333",
  },
  linkText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textDecorationLine: "underline"
  },
  disabledText: {
    color: '#888888',
  },
});
