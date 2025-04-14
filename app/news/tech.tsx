import { View, FlatList, ActivityIndicator } from "react-native";
import NewsCard from "@/components/NewsCard";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext } from "react";
import NewsContext from "../data/NewsProvider";

const Technology = () => {

    const context = useContext(NewsContext);
    if (!context) throw new Error("Must be used inside a context");

    const {setTag, news, loading ,setLoading} = context;

    useFocusEffect(
        useCallback(() => {
            setTag("technology")
            setLoading(true)
        }, [])
    )
    
    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size={"large"} />
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
}
 
export default Technology;