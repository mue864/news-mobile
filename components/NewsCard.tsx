import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}

type pageValues = {
  id: string;
  title: string;
  section: string;
  image?: string;
  url: string;
};

const NewsCard: React.FC<NewsCardProps> = ({ news, isFirst }) => {
  const [like, setLike] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  const page = {
    id: "",
    title: "",
    section: "",
    image: "",
    isLiked: false,
    url: "",
  };
  const registerLikeClick = () => {
    setLike((prev) => !prev);
    getFromStorage();
  };

  const registerBookMarkClick = (news: pageValues, isLiked: boolean) => {
    setBookmark((prev) => !prev);

    savePage(news, isLiked);
    saveToStorage(page);
  };

  const savePage = (news: pageValues, isLiked: boolean) => {
    page.id = news.id;
    page.title = news.title;
    page.section = news.section
    page.image = news.image || ""; // if image is undefined, then we set it to an empty string
    page.url = news.url;
    page.isLiked = isLiked;
  };

  const saveToStorage = async (data) => {
    try {
      const userData = JSON.stringify(data)
      await AsyncStorage.setItem('data', userData)
      console.log("Data Saved!");
    } catch (error) {
      console.error("Something happened when saving data: ", error);
    }
  };

  const getFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("data")
      
      if (storedData !== null) {
        console.log(storedData);
      }
    } catch(error) {
      console.error("Error getting data: ", error);
    }
  }

  return (
    <View style={[styles.card, isFirst && styles.firstCard]}>
      <StatusBar barStyle={"dark-content"} />
      <Image
        source={{ uri: news.image }}
        style={[styles.image, isFirst && styles.firstImage]}
      />
      <View style={[styles.textWrapper, isFirst && styles.firstTextWrapper]}>
        <Text style={[styles.headingText, isFirst && styles.headingFirstText]}>
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

          <Pressable onPress={() => registerBookMarkClick(news, like)}>
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
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  firstCard: {
    flexDirection: "column",
    height: "auto",
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingTop: 0,
  },
  firstImage: {
    width: deviceWidth,
    height: 200,
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
