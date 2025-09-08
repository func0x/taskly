import { StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";

const shoppingItems = [
  { name: "Coffee ☕️" },
  { name: "Tea 🫖", isCompleted: true },
  { name: "Milk 🥛" },
  { name: "Cake 🍰" },
];

export default function App() {
  return (
    <View style={styles.container}>
      {shoppingItems.map((task, index) => {
        return (
          <ShoppingListItem
            key={index}
            name={task.name}
            isCompleted={task.isCompleted}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
});
