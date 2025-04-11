import { Text, View, ActivityIndicator, FlatList } from "react-native";
import NewsCard from "@/components/NewsCard";
import NewsContext from "../data/NewsProvider";
import { useCallback, useContext } from "react";
import { useFocusEffect } from "expo-router";
const Sport = () => {
  const { setTag, loading, news } = useContext(NewsContext);
 
  useFocusEffect(
    useCallback(() => {
      console.log("focused")
      setTag("sport")
    }, [])
  );
  return(
    <View style={{flex: 1}}>
      { loading ? (<ActivityIndicator size={'large'} />) :
        (
          <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => (
            <NewsCard
             news={item}
             isFirst={index === 0}
            />
          )}
          />
        )
      }
    </View>
  );
};

export default Sport;
