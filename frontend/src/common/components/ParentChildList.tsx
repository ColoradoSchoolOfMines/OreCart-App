import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

import { type Query } from "../query";

import Divider from "./Divider";
import ErrorMessage from "./ErrorMessage";
import SkeletonList from "./SkeletonList";

export interface ParentChildListProps<P, C> {
  header: (parent: P) => React.JSX.Element;
  headerSkeleton?: () => React.JSX.Element;
  item: (parent: P, child: C) => React.JSX.Element;
  itemSkeleton: () => React.JSX.Element;
  divider: "line" | "space";
  keyExtractor: (item: C) => string;
  map: (parent: P) => C[];
  query: Query<P>;
  refresh: () => Promise<object>;
  errorMessage: string;
}

function ParentChildList<P, C>({
  header,
  headerSkeleton,
  item,
  itemSkeleton,
  divider,
  keyExtractor,
  map,
  query,
  refresh,
  errorMessage,
}: ParentChildListProps<P, C>): React.JSX.Element {
  return query.isSuccess ? (
    <BottomSheetFlatList
      data={map(query.data)}
      renderItem={({ item: child }) => item(query.data, child)}
      ListHeaderComponent={() => header(query.data)}
      ItemSeparatorComponent={divider === "line" ? Divider : Divider}
      focusHook={useFocusEffect}
      keyExtractor={keyExtractor}
    />
  ) : query.isLoading ? (
    <SkeletonList
      headerSkeleton={headerSkeleton}
      itemSkeleton={itemSkeleton}
      divider={divider}
    />
  ) : (
    <ErrorMessage message={errorMessage} retry={refresh} />
  );
}

export default ParentChildList;
