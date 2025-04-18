import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  Share
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

      const onShare = async (title: string, url: string) => {
        try {
          await Share.share({
            message: `${title} \n Read More \n ${url}`,
          });
        } catch (error) {
          console.error("An error has happened: ", error);
        }
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
    } catch (error) {
      console.error("Something happened when saving data: ", error);
    }
  };

  return (
    <View style={{ paddingHorizontal: 14 }}>
      <TouchableOpacity
        style={[styles.card, isFirst && styles.firstCard]}
        onPress={() =>
          route.push({
            pathname: "/webpage",
            params: { url: news.url },
          })
        }
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

          <View style={{ flex: 1 }}>
            {isFirst && (
              <View>
                <Pressable
                  style={styles.readMore}
                  onPress={() =>
                    route.push({
                      pathname: "/webpage",
                      params: { url: news.url },
                    })
                  }
                >
                  <Text style={styles.readMoreText}>Read More</Text>
                </Pressable>
              </View>
            )}
            <View style={[styles.miniBar, isFirst && styles.miniBarFirst]}>
              <Pressable onPress={registerLikeClick}>
                <FontAwesome6
                  name="thumbs-up"
                  size={21}
                  color={like ? "#3B82F6" : "#C0C0C0"}
                  solid={like}
                />
              </Pressable>

              <Pressable
                onPress={() => registerBookMarkClick(news, like, bookmark)}
              >
                <FontAwesome6
                  name="bookmark"
                  size={21}
                  color={bookmark ? "#3B82F6" : "#C0C0C0"}
                  solid={bookmark}
                />
              </Pressable>

              <Pressable onPress={() => onShare(news.title, news.url)}>
                <FontAwesome6 name="share" size={21} color={"#C0C0C0"} />
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NewsCard;

const deviceWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    flexDirection: "row-reverse",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
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
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    width: 200,
    color: "#374151",
  },
  headingFirstText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    width: "auto",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  miniBar: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  miniBarFirst: {
    marginTop: 10,
    justifyContent: "flex-end",
    paddingLeft: 70,
  },
  readMore: {
    backgroundColor: "#1E293B",
    width: 90,
    alignItems: "center",
    borderRadius: 50,
    top: 40,
    padding: 4,
  },
  readMoreText: {
    color: "#fff",
    fontWeight: "500",
  },
});
