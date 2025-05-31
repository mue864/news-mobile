import { Text, SafeAreaView, FlatList, View, StyleSheet, Animated, TouchableOpacity, RefreshControl, Dimensions, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface BookMarksProps {
    id: string,
    title: string,
    section: string,
    date: string,
    url: string,
    image: string,
    isBookMarked: boolean,
    isLiked: boolean,
}

const BookMarks = () => {
    const [data, setData] = useState<BookMarksProps[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const flatListRef = useRef<FlatList<BookMarksProps>>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    
    // Store item animations in a ref to prevent recreation
    const itemAnimationsRef = useRef<{[key: string]: {opacity: Animated.Value, translateY: Animated.Value}}>({});

    // Animated values for header
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [120, 70],
        extrapolate: 'clamp'
    });

    const headerTitleOpacity = scrollY.interpolate({
        inputRange: [0, 60, 90],
        outputRange: [0, 0.3, 1],
        extrapolate: 'clamp'
    });

    const headerSubtitleOpacity = scrollY.interpolate({
        inputRange: [0, 60, 90],
        outputRange: [1, 0.3, 0],
        extrapolate: 'clamp'
    });

    // Scroll to top button animation
    const scrollTopButtonOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scrollTopButtonOpacity, {
            toValue: showScrollTopButton ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [showScrollTopButton]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            // Reset animations when screen comes into focus
            itemAnimationsRef.current = {};
        }, [])
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const savedData = await AsyncStorage.getItem("data");

            if (savedData !== null) {
                const localData = JSON.parse(savedData);
                setData(localData);
            }
        } catch (error) {
            console.error("Something happened: ", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Reset animations when refreshing
        itemAnimationsRef.current = {};
        fetchData();
    }, []);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { 
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                setShowScrollTopButton(offsetY > 200);
            }
        }
    );

    const scrollToTop = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    // Animation values for empty state
    const emptyOpacity = useRef(new Animated.Value(0)).current;
    const emptyScale = useRef(new Animated.Value(0.9)).current;
    
    // Empty state animation
    useEffect(() => {
        if (!loading && data.length === 0) {
            Animated.parallel([
                Animated.timing(emptyOpacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(emptyScale, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Reset animations when data changes
            emptyOpacity.setValue(0);
            emptyScale.setValue(0.9);
        }
    }, [loading, data.length]);
    
    // Render empty state
    const renderEmptyState = () => {
        if (loading) return renderLoadingState();
        
        return (
            <Animated.View 
                style={[
                    styles.emptyContainer,
                    {
                        opacity: emptyOpacity,
                        transform: [{ scale: emptyScale }]
                    }
                ]}
            >
                <MaterialCommunityIcons name="bookmark-off-outline" size={80} color="#888" />
                <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
                <Text style={styles.emptySubtitle}>Articles you bookmark will appear here</Text>
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/(tabs)/news/' as any);
                    }}
                    style={styles.browseButton}
                >
                    <LinearGradient
                        colors={['#4a6fa1', '#2c3e50']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.browseButtonText}>Browse News</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // Animation values for loading state
    const loadingOpacity = useRef(new Animated.Value(0)).current;
    const iconScale = useRef(new Animated.Value(0.9)).current;
    const iconOpacity = useRef(new Animated.Value(0.5)).current;
    
    // Loading state animation
    useEffect(() => {
        if (loading) {
            // Fade in animation
            Animated.timing(loadingOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
            
            // Pulsing animation for the icon
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(iconScale, {
                            toValue: 1,
                            duration: 700,
                            useNativeDriver: true,
                        }),
                        Animated.timing(iconOpacity, {
                            toValue: 1,
                            duration: 700,
                            useNativeDriver: true,
                        })
                    ]),
                    Animated.parallel([
                        Animated.timing(iconScale, {
                            toValue: 0.9,
                            duration: 700,
                            useNativeDriver: true,
                        }),
                        Animated.timing(iconOpacity, {
                            toValue: 0.5,
                            duration: 700,
                            useNativeDriver: true,
                        })
                    ])
                ])
            );
            
            pulseAnimation.start();
            
            return () => {
                pulseAnimation.stop();
            };
        } else {
            // Reset animations when not loading
            loadingOpacity.setValue(0);
        }
    }, [loading]);
    
    // Render loading state
    const renderLoadingState = () => {
        return (
            <Animated.View 
                style={[
                    styles.loadingContainer,
                    { opacity: loadingOpacity }
                ]}
            >
                <Animated.View
                    style={{
                        transform: [{ scale: iconScale }],
                        opacity: iconOpacity
                    }}
                >
                    <MaterialCommunityIcons name="bookmark-outline" size={50} color="#4a6fa1" />
                </Animated.View>
                <Text style={styles.loadingText}>Loading bookmarks...</Text>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with gradient background */}
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <LinearGradient
                    colors={['#4a6fa1', '#2c3e50']}
                    style={styles.headerGradient}
                >
                    <Animated.Text
                        style={[styles.headerTitle, { opacity: headerTitleOpacity }]}
                    >
                        Bookmarks
                    </Animated.Text>
                    <Animated.Text
                        style={[styles.headerSubtitle, { opacity: headerSubtitleOpacity }]}
                    >
                        Your Saved Articles
                    </Animated.Text>
                </LinearGradient>
            </Animated.View>

            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4a6fa1"
                        colors={['#4a6fa1', '#2c3e50']}
                    />
                }
                ListEmptyComponent={renderEmptyState}
                renderItem={({ item, index }) => {
                    // Get or create animations for this item
                    if (!itemAnimationsRef.current[item.id]) {
                        itemAnimationsRef.current[item.id] = {
                            opacity: new Animated.Value(0),
                            translateY: new Animated.Value(20)
                        };
                        
                        // Start the animation with delay based on index
                        setTimeout(() => {
                            const animations = itemAnimationsRef.current[item.id];
                            if (animations) {
                                Animated.parallel([
                                    Animated.timing(animations.opacity, {
                                        toValue: 1,
                                        duration: 400,
                                        useNativeDriver: true,
                                    }),
                                    Animated.timing(animations.translateY, {
                                        toValue: 0,
                                        duration: 400,
                                        useNativeDriver: true,
                                    })
                                ]).start();
                            }
                        }, index * 100);
                    }
                    
                    const animations = itemAnimationsRef.current[item.id] || {
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
                                isLiked={item.isLiked}
                                isBookMarked={item.isBookMarked}
                            />
                        </Animated.View>
                    );
                }}
            />

            {/* Scroll to top button */}
            <Animated.View
                style={[styles.scrollTopButton, { opacity: scrollTopButtonOpacity }]}
                pointerEvents={showScrollTopButton ? 'auto' : 'none'}
            >
                <TouchableOpacity
                    onPress={scrollToTop}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#4a6fa1', '#2c3e50']}
                        style={styles.scrollTopButtonGradient}
                    >
                        <Ionicons name="arrow-up" size={24} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        width: '100%',
        justifyContent: 'flex-end',
        paddingBottom: 10,
        zIndex: 10,
    },
    headerGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 5,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 20,
        minHeight: Dimensions.get('window').height - 120,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    browseButton: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 10,
    },
    gradientButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    scrollTopButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 100,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    scrollTopButtonGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BookMarks;