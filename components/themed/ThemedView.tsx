import {StyleSheet, View, type ViewProps} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from "@/components/Header";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  showHeader?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, showHeader = true, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
      <View
          style={[styles.container, { backgroundColor }, style]}
          {...otherProps}
      >
        { showHeader && <Header /> }
        <View {...otherProps} />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
