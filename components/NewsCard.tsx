import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    section: string;
    date: string;
    url: string;
    image?: string;
  };
  isFirst: boolean;
  isLiked: boolean;
  isBookMarked: boolean;
}

type pageValues = {
  id: string;
  title: string;
  section: string;
  image?: string;
  url: string;
};

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  isFirst,
  isLiked,
  isBookMarked,
}) => {
  const [like, setLike] = useState(isLiked);
  const [bookmark, setBookmark] = useState(isBookMarked);
  const route = useRouter();
  const page = {
    id: "",
    title: "",
    section: "",
    image: "",
    isLiked: false,
    isBookMarked: false,
    url: "",
  };

  const registerLikeClick = () => {
    setLike((prev) => !prev);
  };

  const registerBookMarkClick = (
    news: pageValues,
    isLiked: boolean,
    bookmark: boolean
  ) => {
    const pageToSave = {
      id: news.id,
      title: news.title,
      section: news.section,
      image: news.image || "",
      url: news.url,
      isLiked,
      isBookMarked: true,
    };

    setBookmark((prev) => !prev);
    saveToStorage(pageToSave);
  };

  const saveToStorage = async (data: { id: string }) => {
    try {
      const prevData = await AsyncStorage.getItem("data");
      let updatedData = [];
      if (prevData !== null) {
        updatedData = JSON.parse(prevData);

        const alreadyExists = updatedData.some(
          (item: { id: string }) => item.id === data.id
        );
        if (alreadyExists) return;
      }

      updatedData.push(data);
      await AsyncStorage.setItem("data", JSON.stringify(updatedData));
      console.log("Data Saved!");
    } catch (error) {
      console.error("Something happened when saving data: ", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        route.push({
          pathname: "/webpage",
          params: { url: news.url },
        })
      }
      style={{paddingHorizontal: 14}}
    >
      <View
        style={[styles.card, isFirst && styles.firstCard]}
        focusable={false}

      >
        <StatusBar barStyle={"dark-content"} />
        <Image
          source={{ uri: news.image }}
          style={[styles.image, isFirst && styles.firstImage]}
        />
        <View style={[styles.textWrapper, isFirst && styles.firstTextWrapper]}>
          <Text
            style={[styles.headingText, isFirst && styles.headingFirstText]}
          >
            {news.title}
          </Text>
          <View style={[styles.miniBar, isFirst && styles.miniBarFirst]}>
            <Pressable onPress={registerLikeClick}>
              <FontAwesome6
                name="thumbs-up"
                size={21}
                color={like ? "#B91C1C" : "#C0C0C0"}
                solid={like}
              />
            </Pressable>

            <Pressable
              onPress={() => registerBookMarkClick(news, like, bookmark)}
            >
              <FontAwesome6
                name="bookmark"
                size={21}
                color={bookmark ? "#B91C1C" : "#C0C0C0"}
                solid={bookmark}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;

const deviceWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    flexDirection: "row-reverse",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  firstCard: {
    flexDirection: "column",
    height: "auto",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  firstImage: {
    width: 330,
    height: 200,
    borderRadius: 12,
    padding: 5,
    marginTop: 17,
  },
  firstTextWrapper: {
    padding: 10,
  },
  textWrapper: {
    flex: 1,
  },
  headingText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },
  headingFirstText: {
    fontSize: 18,
    textAlign: "center",
  },
  image: {
    width: 80,
    height: 80,
  },
  miniBar: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  miniBarFirst: {
    marginTop: 15,
    justifyContent: "flex-end",
    paddingLeft: 70,
  },
});
