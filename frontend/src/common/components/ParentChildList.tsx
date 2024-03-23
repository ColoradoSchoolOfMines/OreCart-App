import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, type ViewProps } from "react-native";

import { type Query } from "../query";

import Divider from "./Divider";
import ErrorMessage from "./ErrorMessage";
import SkeletonList from "./SkeletonList";

export interface ParentChildListProps<P, C> extends ViewProps {
  header: (parent: P) => React.JSX.Element;
  headerSkeleton?: () => React.JSX.Element;
  item: (parent: P, child: C) => React.JSX.Element;
  itemSkeleton: () => React.JSX.Element;
  divider: "line" | "space";
  keyExtractor: (item: C) => string;
  bottomSheet: boolean;
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
  bottomSheet,
  map,
  query,
  refresh,
  errorMessage,
  ...props
}: ParentChildListProps<P, C>): React.JSX.Element {
  return query.isSuccess ? (
    bottomSheet ? (
      <BottomSheetFlatList
        {...props}
        data={map(query.data)}
        renderItem={({ item: child }) => item(query.data, child)}
        ListHeaderComponent={() => header(query.data)}
        ItemSeparatorComponent={divider === "line" ? Divider : Divider}
        focusHook={useFocusEffect}
        keyExtractor={keyExtractor}
      />
    ) : (
      <FlatList
        {...props}
        data={map(query.data)}
        renderItem={({ item: child }) => item(query.data, child)}
        ListHeaderComponent={() => header(query.data)}
        ItemSeparatorComponent={divider === "line" ? Divider : Divider}
        keyExtractor={keyExtractor}
      />
    )
  ) : query.isLoading ? (
    <SkeletonList
      {...props}
      headerSkeleton={headerSkeleton}
      itemSkeleton={itemSkeleton}
      divider={divider}
    />
  ) : (
    <ErrorMessage {...props} message={errorMessage} retry={refresh} />
  );
}

export default ParentChildList;
