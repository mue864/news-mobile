import { Text, SafeAreaView, FlatList, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import NewsCard from "@/components/NewsCard";

interface BookMarksProps {
    id: string,
    title: string,
    section: string,
    url: string,
    image: string,
    isBookMarked: boolean,
    isLiked: boolean,
}
const BookMarks = () => {
    const [data, setData] = useState([]);

    let localData = [];
    useFocusEffect(
        useCallback(() => {
            fetchData();
            console.log(data)
        }, [])
    );

    const fetchData = async () => {
       try {
         const savedData = await AsyncStorage.getItem("data");

        if (savedData !== null) {
            localData = JSON.parse(savedData);
            setData(localData);
        }
       } catch (error) {
         console.error("Something happened: ", error);
       }
    };

    return ( 
       <SafeAreaView style={{flex: 1}}>
        <FlatList 
         data={data}
         keyExtractor={(item) => item.id}
         renderItem={({item, index}) => (
            <View>
                <NewsCard
                news={item}
                isFirst={index === 0}
                isLiked={item.isLiked}
                isBookMarked={item.isBookMarked}
                />
            </View>
         )}
        />
       </SafeAreaView>
     );
}

export default BookMarks;