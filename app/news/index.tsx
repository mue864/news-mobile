import { 
  ActivityIndicator, 
  FlatList, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  RefreshControl, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  StatusBar,
  Platform
} from 'react-native';
import { useCallback, useContext, useState, useRef, useEffect } from 'react';
import NewsContext from "../data/NewsProvider";
import { useFonts } from "expo-font";
import NewsCard from "@/components/NewsCard";
import { useFocusEffect } from "expo-router";
import { MaterialIcons, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
// Using a custom type for AnimatePresence since it might not be exported directly
type AnimatePresenceProps = {
  children: React.ReactNode;
  exitBeforeEnter?: boolean;
  initial?: boolean;
  onExitComplete?: () => void;
};
const AnimatePresence: React.FC<AnimatePresenceProps> = ({ children }) => <>{children}</>;

// Colors
const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  secondary: '#F59E0B',
  secondaryLight: '#FBBF24',
  dark: '#1F2937',
  light: '#F9FAFB',
  gray: '#6B7280',
  white: '#FFFFFF',
  black: '#111827',
  background: '#F9FAFB',
  card: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
};

interface ContextProps {
  news: {};
  loading: boolean;
}

// Categories for the horizontal scroll
const categories = [
  { id: 'world', name: 'World' },
  { id: 'business', name: 'Business' },
  { id: 'technology', name: 'Tech' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
];

const NewsPage = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("Context must be used within a provider!");
  const { news, loading, setTag, setLoading, fetchData } = context;
  
  const [activeCategory, setActiveCategory] = useState('world');
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const fabOpacity = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(Platform.OS === 'ios' ? 120 : 100)).current;
  
  // Animation refs for news cards - store as a ref to prevent re-creation
  const newsCardAnimationsRef = useRef<{[key: number]: {opacity: Animated.Value, translateY: Animated.Value}}>({});
  
  // Animation refs for empty state
  const emptyStateOpacity = useRef(new Animated.Value(0)).current;
  const emptyStateScale = useRef(new Animated.Value(0.9)).current;
  
  // Animation refs for header title
  const headerTitleOpacity = useRef(new Animated.Value(0)).current;
  const headerTitleTranslateY = useRef(new Animated.Value(-10)).current;
  
  // Animation ref for loading text
  const loadingTextOpacity = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Roboto: require('../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'),
    Monsterrat: require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
  });

  // Fade in animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      // Animate header title
      Animated.timing(headerTitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerTitleTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    
    // Animate loading text with loop
    const startLoadingAnimation = () => {
      Animated.sequence([
        Animated.timing(loadingTextOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(loadingTextOpacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => startLoadingAnimation());
    };
    
    startLoadingAnimation();
  }, []);
  
  // Header animation based on scroll
  const headerHeightInterpolate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === 'ios' ? 120 : 100, Platform.OS === 'ios' ? 80 : 70],
    extrapolate: 'clamp'
  });
  
  // Show/hide scroll to top button
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      if (value > 300 && !showScrollToTop) {
        setShowScrollToTop(true);
        Animated.spring(fabOpacity, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }).start();
      } else if (value <= 300 && showScrollToTop) {
        Animated.timing(fabOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowScrollToTop(false));
      }
    });
    
    return () => scrollY.removeListener(listenerId);
  }, [scrollY, showScrollToTop]);

  const onRefresh = useCallback(async () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Clear previous animations
    newsCardAnimationsRef.current = {};
    
    // Reset empty state animations
    emptyStateOpacity.setValue(0);
    emptyStateScale.setValue(0.9);
    
    setRefreshing(true);
    setLoading(true);
    await fetchData(activeCategory);
    setRefreshing(false);
  }, [activeCategory, fetchData, setLoading, emptyStateOpacity, emptyStateScale]);

  const flatListRef = useRef<FlatList<any>>(null);

  const scrollToTop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCategory(categoryId);
    setLoading(true);
    fetchData(categoryId);
    
    // Scroll to top when changing category
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      setTag("world");
      return () => setLoading(false);
    }, [])
  );

  // Fetch news when category changes
  useEffect(() => {
    // Clear previous animations
    newsCardAnimationsRef.current = {};
    
    // Reset empty state animations
    emptyStateOpacity.setValue(0);
    emptyStateScale.setValue(0.9);
    
    setLoading(true);
    setTag(activeCategory);
  }, [activeCategory, setTag, setLoading, emptyStateOpacity, emptyStateScale]);

  const renderCategoryItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item.id)}
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem,
      ]}
    >
      {activeCategory === item.id ? (
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryItemGradient}
        >
          <Text style={styles.activeCategoryText}>{item.name}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.categoryText}>{item.name}</Text>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeightInterpolate }]}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Animated.View
            style={{
              opacity: headerTitleOpacity,
              transform: [{ translateY: headerTitleTranslateY }]
            }}
          >
            <Text style={styles.headerTitle}>NewsFlash</Text>
          </Animated.View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="notifications-none" size={24} color={COLORS.white} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="search" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Create and initialize news card animations
  useEffect(() => {
    if (!loading && news.length > 0) {
      // Create animations for each news item
      news.forEach((_, index) => {
        if (!newsCardAnimationsRef.current[index]) {
          newsCardAnimationsRef.current[index] = {
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(20)
          };
          
          // Start the animation with delay based on index
          setTimeout(() => {
            const animations = newsCardAnimationsRef.current[index];
            if (animations) {
              Animated.parallel([
                Animated.timing(animations.opacity, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                  easing: Easing.out(Easing.cubic)
                }),
                Animated.timing(animations.translateY, {
                  toValue: 0,
                  duration: 600,
                  useNativeDriver: true,
                  easing: Easing.out(Easing.cubic)
                })
              ]).start();
            }
          }, index * 100);
        }
      });
    }
  }, [loading, news.length]);
  
  const renderNewsCard = ({ item, index }: { item: any; index: number }) => {
    // Get the animations for this card or create default values
    const animations = newsCardAnimationsRef.current[index] || {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20)
    };
    
    return (
      <Animated.View
        style={{
          opacity: animations.opacity,
          transform: [{ translateY: animations.translateY }]
        }}
      >
        <NewsCard
          news={item}
          isFirst={index === 0}
          isLiked={false}
          isBookMarked={false}
        />
      </Animated.View>
    );
  };

  // Empty state animation
  useEffect(() => {
    if (!loading && news.length === 0) {
      Animated.parallel([
        Animated.spring(emptyStateOpacity, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.spring(emptyStateScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true
        })
      ]).start();
    } else {
      // Reset animations when data is loaded
      emptyStateOpacity.setValue(0);
      emptyStateScale.setValue(0.9);
    }
  }, [loading, news.length]);
  
  const renderEmptyComponent = () => {
    return (
      <Animated.View 
        style={[
          styles.emptyContainer,
          {
            opacity: emptyStateOpacity,
            transform: [{ scale: emptyStateScale }]
          }
        ]}
      >
        <MaterialIcons name="newspaper" size={80} color={COLORS.gray} />
        <Text style={styles.emptyText}>
          No news found for this category. Please try another category or check your internet connection.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.refreshButtonGradient}
          >
            <Text style={styles.refreshText}>Refresh</Text>
            <MaterialIcons name="refresh" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity,
            transform: [{ translateY }, { scale }] 
          }
        ]}
      >
        {renderHeader()}
        
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        <FlatList
          ref={flatListRef}
          data={news}
          renderItem={renderNewsCard}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={!loading ? renderEmptyComponent() : null}
          contentContainerStyle={styles.newsList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
        
        {loading && news.length === 0 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Animated.Text
              style={[styles.loadingText, {
                opacity: loadingTextOpacity
              }]}
            >
              Loading news...
            </Animated.Text>
          </View>
        )}
        
        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollToTop && (
            <Animated.View 
              style={[
                styles.scrollToTopButton,
                { opacity: fabOpacity }
              ]}
            >
              <TouchableOpacity 
                onPress={scrollToTop}
                style={styles.scrollToTopButtonInner}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.scrollToTopGradient}
                >
                  <MaterialIcons name="arrow-upward" size={24} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </AnimatePresence>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: 'InterBold',
    letterSpacing: 0.5,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    overflow: 'hidden',
  },
  categoryItemGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeCategoryItem: {
    // Gradient is applied in the component
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'InterMedium',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeCategoryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontFamily: 'InterMedium',
  },
  newsList: {
    paddingBottom: 100, // Extra padding for scroll to top button
    paddingTop: 16,
    minHeight: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'InterRegular',
    lineHeight: 24,
  },
  refreshButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  refreshButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    color: COLORS.white,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.primary,
    fontFamily: 'InterMedium',
    fontSize: 16,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 999,
  },
  scrollToTopButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scrollToTopGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsPage;
