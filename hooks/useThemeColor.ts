/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import {AppTheme} from "@/context/ThemeContext";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const {theme} = AppTheme()
  const appTheme = theme ?? 'light';
  const colorFromProps = props[appTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[appTheme][colorName];
  }
}
