import { Text, type TextProps } from "react-native";

import { type, type TypeVariant, useTheme } from "@/theme";

export function ThemedText({
  variant = "body",
  style,
  ...props
}: TextProps & { variant?: TypeVariant }) {
  const { colors } = useTheme();
  const color = ["subhead", "caption", "mono"].includes(variant) ? colors.secondaryLabel : variant === "overline" ? colors.tertiaryLabel : colors.label;
  return <Text {...props} style={[type[variant], { color }, style]} />;
}
