import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

import { type Query } from "../query";

import { RefreshControl, type ViewProps } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Divider from "./Divider";
import ErrorMessage from "./ErrorMessage";
import SkeletonList from "./SkeletonList";
import Spacer from "./Spacer";

export interface ListProps<T> extends ViewProps {
  header?: () => React.JSX.Element;
  item: (item: T) => React.JSX.Element;
  itemSkeleton: () => React.JSX.Element;
  divider: "line" | "space";
  keyExtractor: (item: T) => string;
  bottomSheet: boolean;
  query: Query<T[]>;
  refresh: () => Promise<object>;
  errorMessage: string;
}

function List<T>({
  header,
  item,
  itemSkeleton,
  divider,
  keyExtractor,
  bottomSheet,
  query,
  refresh,
  errorMessage,
  ...props
}: ListProps<T>): React.JSX.Element {
  return query.isSuccess ? (
    bottomSheet ? (
      <BottomSheetFlatList
        {...props}
        data={query.data}
        renderItem={({ item: data }) => item(data)}
        ListHeaderComponent={header}
        ItemSeparatorComponent={divider === "line" ? Divider : Spacer}
        focusHook={useFocusEffect}
        keyExtractor={keyExtractor}
      />
    ) : (
      <FlatList
        {...props}
        data={query.data}
        renderItem={({ item: data }) => item(data)}
        ListHeaderComponent={header}
        ItemSeparatorComponent={divider === "line" ? Divider : Spacer}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={query.isLoading}
            enabled={query.data !== undefined}
            onRefresh={() => {
              refresh().catch(() => {});
            }}
          />
        }
      />
    )
  ) : query.isLoading ? (
    <SkeletonList {...props} itemSkeleton={itemSkeleton} divider={divider} />
  ) : (
    <ErrorMessage {...props} message={errorMessage} retry={refresh} />
  );
}

export default List;
