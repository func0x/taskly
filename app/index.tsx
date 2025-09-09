import "react-native-get-random-values";
import { StyleSheet, TextInput, FlatList, View, Text } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted?: boolean;
  completedAtTimestamp?: number;
};

const initialList: ShoppingListItemType[] = [
  { id: uuidv4(), name: "Coffee ☕️" },
  { id: uuidv4(), name: "Tea 🫖", isCompleted: true },
  { id: uuidv4(), name: "Milk 🥛" },
  { id: uuidv4(), name: "Cake 🍰" },
];

export default function App() {
  const [value, setValue] = useState("");
  const [list, setList] = useState(initialList);

  const handleSubmit = () => {
    if (value) {
      const newList = [...list, { id: uuidv4(), name: value }];
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
          isCompleted: !item.isCompleted,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    setList(newList);
  };

  return (
    <FlatList
      data={list}
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
          isCompleted={item.isCompleted}
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

const styles = StyleSheet.create({
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 12,
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
