import { Text, View, ActivityIndicator, FlatList } from "react-native";
import NewsCard from "@/components/NewsCard";
import NewsContext from "../data/NewsProvider";
import { useCallback, useContext } from "react";
import { useFocusEffect } from "expo-router";


const Sport = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("Must be used inside a context");

  const {setTag, setLoading, loading, news} = context;
 
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
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
