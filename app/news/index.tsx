import { ActivityIndicator, FlatList, View } from "react-native";
import { useCallback, useContext, useState } from "react";
import NewsContext from "../data/NewsProvider";
import { useFonts } from "expo-font";
import NewsCard from "@/components/NewsCard";
import { useFocusEffect } from "expo-router";

interface ContextProps {
  news: {};
  loading: boolean;
}

const NewsPage = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("Context must be used within a provider!");
  const { news, loading, setTag, setLoading } = context;

  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
    Monsterrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  useFocusEffect(
    useCallback(() => {
      setLoading(false)
      setTag("world")
    }, [])
  );
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
