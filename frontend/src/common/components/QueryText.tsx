import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, type TextProps } from "react-native";

import { type Query } from "../query";
import Color from "../style/color";

import TextSkeleton from "./TextSkeleton";

interface QueryTextProps<T> extends TextProps {
  query: Query<T>;
  body: (data: T) => string;
  skeletonWidth: number;
  error?: string;
}

function QueryText<T>({
  query,
  body,
  skeletonWidth,
  error,
  style,
  ...props
}: QueryTextProps<T>): React.JSX.Element {
  if (query.isSuccess) {
    return (
      <Text style={style} {...props}>
        {body(query.data)}
      </Text>
    );
  }
  if (query.isLoading) {
    return (
      <TextSkeleton style={style} widthFraction={skeletonWidth} {...props} />
    );
  }
  if (query.isError && error !== undefined) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons
          name="error"
          size={16}
          style={styles.errorIcon}
          color={Color.generic.alert.primary}
        />
        <Text style={[style, styles.error]} {...props}>
          {error}
        </Text>
      </View>
    );
  }
  return <Text {...props} />;
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  error: {
    color: Color.generic.alert.primary,
    alignSelf: "center",
  },
  errorIcon: {},
});

export default QueryText;
