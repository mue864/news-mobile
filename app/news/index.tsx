import { ActivityIndicator, FlatList, View, SafeAreaView, TouchableOpacity, RefreshControl } from "react-native";
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
  const { news, loading, setTag, setLoading, fetchData } = context;

  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
    Monsterrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setLoading(true);
    fetchData("world");
    
    setTimeout(() => {
      setRefresh(false);
    }, 1000)
  }, [setLoading]);

  useFocusEffect(
    useCallback(() => {
      setLoading(false)
      setTag("world")
    }, [])
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <NewsCard news={item} isFirst={index === 0} isLiked={false} isBookMarked={false} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NewsPage;
