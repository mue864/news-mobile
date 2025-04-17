import { SafeAreaView, View, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import NewsCard from "@/components/NewsCard";
import NewsContext from "../data/NewsProvider";
import { useCallback, useContext, useState } from "react";
import { useFocusEffect } from "expo-router";

const Sport = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("Must be used inside a context");

  const { setTag, setLoading, loading, news, fetchData } = context;
  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setLoading(true);
    fetchData();

    setTimeout(() => {
      setRefresh(false);
    }, 1000)
  }, [setLoading])

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setTag("sport");
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          style={{ justifyContent: "center" }}
        />
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

export default Sport;
