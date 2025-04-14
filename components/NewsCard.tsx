import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Pressable, StatusBar} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';

interface NewsCardProps {
    news: {},
    isFirst: boolean
};


const NewsCard: React.FC<NewsCardProps> = ({news ,isFirst}) => {
  
  const [like, setLike] = useState(false);
  const [bookmark, seBookmark] = useState(false);
  const [color, setColor] = useState("#C0C0C0")

  const registerLikeClick = () => {
    like ? setLike(false) : setLike(true);
  }

    return (
      <View style={[styles.card, isFirst && styles.firstCard]}>
        <StatusBar barStyle={'dark-content'} />
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
            <Pressable>
              <FontAwesome6 name="thumbs-up" size={18} color="#C0C0C0" />
            </Pressable>

            <Pressable>
              <FontAwesome6 name="bookmark" size={18} color="#C0C0C0" />
            </Pressable>
          </View>
        </View>
      </View>
    );
}
 
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
    borderBottomColor: "#D3D3D3"
  },
  firstCard: {
    flexDirection: "column",
    height: "auto",
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingTop: 0
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
    textAlign: "left"
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
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBarFirst: {
    marginTop: 15,
    justifyContent: 'flex-end',
    paddingLeft: 70
  }
});