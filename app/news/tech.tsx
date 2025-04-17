import { SafeAreaView ,View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import NewsCard from "@/components/NewsCard";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import NewsContext from "../data/NewsProvider";

const Technology = () => {

    const context = useContext(NewsContext);
    if (!context) throw new Error("Must be used inside a context");

    const {setTag, news, loading ,setLoading, fetchData} = context;
    const [refresh, setRefresh] = useState(false);

    const onRefresh = useCallback(async () => {
      setRefresh(true);
      setLoading(true);
      fetchData();

      setTimeout(() => {
        setRefresh(false);
      }, 1000);
    }, [setLoading]);

    useFocusEffect(
        useCallback(() => {
            setTag("technology")
            setLoading(true)
        }, [])
    )
    
    return (
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size={"large"} />
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
}
 
export default Technology;