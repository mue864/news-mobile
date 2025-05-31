import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Share,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Colors
const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  dark: '#1F2937',
  light: '#F9FAFB',
  gray: '#6B7280',
  white: '#FFFFFF',
  black: '#111827',
};

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
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  
  // Animation for card press
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fade in animation
  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);
  
  const page = {
    id: '',
    title: '',
    section: '',
    image: '',
    isLiked: false,
    isBookMarked: false,
    url: '',
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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    route.push({
      pathname: '/webpage',
      params: { url: news.url },
    });
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLike(prev => !prev);
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBookmark(prev => !prev);
    registerBookMarkClick(news, like, !bookmark);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        isFirst && styles.firstCardContainer,
        { opacity: opacityValue }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={animatePress}
        onPress={handlePress}
        style={[styles.card, isFirst && styles.firstCard]}
      >
        <Animated.View
          style={[
            styles.cardInner,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <View style={[
            styles.imageContainer, 
            isFirst && styles.firstCardImageContainer
          ]}>
            <Image
              source={{ uri: news.image }}
              style={[styles.image, isFirst && styles.firstImage]}
              resizeMode="cover"
              defaultSource={require('../assets/images/placeholder-image.jpg')}
            />
            {isFirst && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{news.section}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, isFirst && styles.firstTitle]}>
              {news.title}
            </Text>
            
            <View style={styles.footer}>
              <Text style={styles.time}>2h ago</Text>
              <View style={styles.actions}>
                <Pressable 
                  style={styles.actionButton} 
                  onPress={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                >
                  <MaterialIcons 
                    name={like ? 'favorite' : 'favorite-outline'} 
                    size={20} 
                    color={like ? COLORS.primary : COLORS.gray} 
                  />
                </Pressable>
                
                <Pressable 
                  style={styles.actionButton} 
                  onPress={(e) => {
                    e.stopPropagation();
                    handleBookmark();
                  }}
                >
                  <MaterialIcons 
                    name={bookmark ? 'bookmark' : 'bookmark-outline'} 
                    size={20} 
                    color={bookmark ? COLORS.primary : COLORS.gray} 
                  />
                </Pressable>
                
                <Pressable 
                  style={styles.actionButton} 
                  onPress={(e) => {
                    e.stopPropagation();
                    onShare(news.title, news.url);
                  }}
                >
                  <MaterialIcons 
                    name="share" 
                    size={20} 
                    color={COLORS.gray} 
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NewsCard;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // 24 padding on each side
const FIRST_CARD_HEIGHT = CARD_WIDTH * 0.7;
const CARD_HEIGHT = 160;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  firstCardContainer: {
    paddingTop: 24,
  },
  firstCard: {
    height: FIRST_CARD_HEIGHT,
  },
  cardInner: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160, // Fixed height for the image container
  },
  firstCardImageContainer: {
    height: 200, // Slightly larger for first card
  },
  image: {
    width: '100%',
    height: '100%',
  },
  firstImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  categoryTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  content: {
    padding: 16,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
    fontFamily: 'Roboto',
    lineHeight: 22,
  },
  firstTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'Monsterrat',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  firstCardContent: {
    flexDirection: "column",
    height: "auto",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  firstCardImage: {
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
  smallImage: {
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
