import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

import { type Query } from "../query";

import Divider from "./Divider";
import ErrorMessage from "./ErrorMessage";
import SkeletonList from "./SkeletonList";

export interface ListProps<T> {
  header?: () => React.JSX.Element;
  item: (item: T) => React.JSX.Element;
  itemSkeleton: () => React.JSX.Element;
  divider: "line" | "space";
  keyExtractor: (item: T) => string;
  query: Query<T[]>;
  refresh: () => Promise<object>;
  errorMessage: string;
}

function List<T>({
  header,
  item,
  itemSkeleton,
  keyExtractor,
  divider,
  query,
  refresh,
  errorMessage,
}: ListProps<T>): React.JSX.Element {
  return query.isSuccess ? (
    <BottomSheetFlatList
      data={query.data}
      renderItem={({ item: data }) => item(data)}
      ListHeaderComponent={header}
      ItemSeparatorComponent={divider === "line" ? Divider : Divider}
      focusHook={useFocusEffect}
      keyExtractor={keyExtractor}
    />
  ) : query.isLoading ? (
    <SkeletonList itemSkeleton={itemSkeleton} divider={divider} />
  ) : (
    <ErrorMessage message={errorMessage} retry={refresh} />
  );
}

export default List;
