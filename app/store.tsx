import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";

// Components
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import StoreCard from "@/components/StoreCard";

type IData = {
  id: number;
  title: string | null;
  description: string | null;
  price: number | null;
  category: string;
  created_at: string;
  promotion: number | null;
  image: string | null;
};

type IItem = {
  category: string;
  items: IData[];
};

export default function StoreScreen() {
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    getStoreItem().then();
  }, []);

  const getStoreItem = async () => {
    const { data, error } = await supabase.from("store_item").select();

    if (data) {
      const categories = [...new Set(data.map((item) => item.category))];
      let filterItems = [];

      for (let category of categories) {
        const itemsInCategory: IData[] = data.filter(
          (it) => it.category === category
        );
        const newItem: IItem = {
          category: category,
          items: itemsInCategory,
        };
        filterItems.push(newItem);
      }

      filterItems.sort((itemA: IItem, itemB: IItem) => {
        if (itemA.category === "default") return -1;
        if (itemB.category === "default") return 1;
        return itemA.category.localeCompare(itemB.category);
      });

      setItems(filterItems);
    }
  };

  return (
    <ThemedView>
      <View style={styles.container}>
        {items.map((item: IItem) => {
          return (
            <View style={styles.categoryContainer} key={item.category}>
              <View style={styles.categoryTitle}>
                <ThemedText fontColor={Colors.dark.background}>{item.category.toUpperCase()}</ThemedText>
              </View>

              <View style={styles.category}>
                {item.items.map((data: IData) => {
                  return (
                    <StoreCard
                      title={data.title}
                      description={data.description}
                      price={data.price}
                      image={data.image}
                      key={data.id}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    gap: 32,
  },
  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  categoryTitle: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.salmon,
  },
  category: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
});
