import "react-native-get-random-values";
import { StyleSheet, TextInput, FlatList, View, Text } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const initialList: ShoppingListItemType[] = [
  { id: uuidv4(), name: "Coffee ☕️", lastUpdatedTimestamp: Date.now() },
  {
    id: uuidv4(),
    name: "Tea 🫖",

    lastUpdatedTimestamp: Date.now(),
    completedAtTimestamp: Date.now(),
  },
  { id: uuidv4(), name: "Milk 🥛", lastUpdatedTimestamp: Date.now() },
  { id: uuidv4(), name: "Cake 🍰", lastUpdatedTimestamp: Date.now() },
];

export default function App() {
  const [value, setValue] = useState("");
  const [list, setList] = useState(initialList);

  const handleSubmit = () => {
    if (value) {
      const newList = [
        ...list,
        { id: uuidv4(), name: value, lastUpdatedTimestamp: Date.now() },
      ];
      setList(newList);
      setValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };

  const handleToggleComplete = (id: string) => {
    const newList = list.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        };
      }
      return item;
    });
    setList(newList);
  };

  return (
    <FlatList
      data={orderShoppingList(list)}
      ListEmptyComponent={() => (
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty!</Text>
        </View>
      )}
      ListHeaderComponent={
        <TextInput
          placeholder="E.g. Coffee ☕️"
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          isCompleted={Boolean(item.completedAtTimestamp)}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
        />
      )}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
    />
  );
}

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    backgroundColor: theme.colorWhite,
    borderWidth: 2,
    borderColor: theme.colorLightGrey,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 6,
  },
});
