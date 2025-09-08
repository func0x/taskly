import "react-native-get-random-values";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted?: boolean;
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
    >
      <TextInput
        placeholder="E.g. Coffee ☕️"
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {list.map(({ id, name, isCompleted }) => {
        return (
          <ShoppingListItem key={id} name={name} isCompleted={isCompleted} />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
