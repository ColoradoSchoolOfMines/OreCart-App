import { Text, type TextProps } from "react-native";

import { type Query } from "../query";

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
  if (query.isError) {
    return (
      <Text style={style} {...props}>
        {error ?? ""}
      </Text>
    );
  }
  return <Text {...props} />;
}

export default QueryText;
