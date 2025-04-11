import { ActivityIndicator, FlatList, View } from "react-native";
import { useContext, useState } from "react";
import NewsContext from "../data/NewsProvider";
import { useFonts } from "expo-font";
import NewsCard from "@/components/NewsCard";

interface ContextProps {
  news: {};
  loading: boolean;
}

const NewsPage = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("Context must be used within a provider!");
  const { news, loading } = context;

  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
    Monsterrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <NewsCard news={item} isFirst={index === 0} />
          )}
        />
      )}
    </View>
  );
};

export default NewsPage;
