import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
// Using React Native's Animated API instead of Moti for better compatibility

export default function Index() {
  // State hooks
  const [isModalVisible, setModalVisible] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);
  const route = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const letterSpacing = useRef(new Animated.Value(20)).current;
  
  // Additional animation refs for components that used Moti
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const modalHeaderOpacity = useRef(new Animated.Value(0)).current;
  const modalHeaderScale = useRef(new Animated.Value(0.9)).current;
  const modalContentOpacity = useRef(new Animated.Value(0)).current;
  const modalContentTranslateY = useRef(new Animated.Value(20)).current;
  const continueButtonOpacity = useRef(new Animated.Value(0)).current;
  const continueButtonTranslateY = useRef(new Animated.Value(20)).current;

  // Load fonts
  const [fontsLoaded] = useFonts({
    Roboto: require("../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    // You might want to add more modern fonts if available
  });

  // Check consent status
  useEffect(() => {
    const checkConsent = async () => {
      try {
        const getConsent = await AsyncStorage.getItem("consent");
        if (getConsent === null) {
          setLoading(false);
        } else {
          setConsentGiven(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking consent:", error);
        setLoading(false);
      }
    };
    
    checkConsent();
  }, []);

  // Handle consent given
  const giveConsent = async () => {
    try {
      await AsyncStorage.setItem("consent", "given");
      setConsentGiven(true);
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  // Redirect if consent is given
  useEffect(() => {
    if (consentGiven) {
      route.replace("/news");
    }
  }, [consentGiven, route]);

  // Handle modal visibility
  useEffect(() => {
    if (isModalVisible) {
      // Animate modal components that previously used Moti
      Animated.sequence([
        Animated.parallel([
          Animated.timing(modalHeaderOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(modalHeaderScale, {
            toValue: 1,
            duration: 600,
            easing: Easing.bounce,
            useNativeDriver: true,
          })
        ]),
        Animated.parallel([
          Animated.timing(modalContentOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(modalContentTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          })
        ]),
        Animated.parallel([
          Animated.timing(continueButtonOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(continueButtonTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          })
        ])
      ]).start();
    }
  }, [isModalVisible, modalHeaderOpacity, modalHeaderScale, modalContentOpacity, modalContentTranslateY, continueButtonOpacity, continueButtonTranslateY]);

  // Splash screen animation sequence
  useEffect(() => {
    if (!loading && fontsLoaded) {
      // First animate the splash screen
      Animated.sequence([
        // Start with the splash animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(letterSpacing, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // Animate components that previously used Moti
          Animated.timing(iconOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          })
        ]),
        // Hold for a moment
        Animated.delay(1000),
        // Then fade out the splash and show the main content
        Animated.timing(fadeAnim, {
          toValue: splashComplete ? 1 : 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setSplashComplete(true);
        // Once splash is done, animate the main content
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(slideUpAnim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [loading, fontsLoaded, fadeAnim, slideUpAnim, scaleAnim, rotateAnim, letterSpacing, splashComplete]);

  // Show loading state
  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }
  
  // Calculate rotation interpolation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    route.replace("/news");
    giveConsent();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {!splashComplete ? (
        // Splash Screen
        <LinearGradient
          colors={['#4F46E5', '#6366F1', '#818CF8']}
          style={styles.splashContainer}
        >
          <Animated.View style={{
            transform: [
              { scale: scaleAnim },
              { rotate: spin }
            ],
            opacity: fadeAnim
          }}>
            <Animated.View
              style={[styles.iconContainer, {
                opacity: iconOpacity
              }]}
            >

              <Ionicons name="newspaper" size={80} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>
          
          <Animated.View style={{
            marginTop: 20,
            transform: [{ translateX: letterSpacing }]
          }}>
            <Animated.Text
              style={[styles.splashTitle, {
                opacity: titleOpacity
              }]}
            >

              NEWSFLASH
            </Animated.Text>
          </Animated.View>
        </LinearGradient>
      ) : (
        // Main Welcome Screen
        <Animated.View 
          style={[styles.container, { opacity: fadeAnim }]}
        >
          <LinearGradient
            colors={['#4F46E5', '#6366F1', '#818CF8']}
            style={styles.hero}
          />
          
          <View style={styles.overlay} />
          
          <Animated.View 
            style={[
              styles.contentContainer,
              { transform: [{ translateY: slideUpAnim }] }
            ]}
          >
          </Animated.View>
          
          <Animated.View
            style={[styles.logoContainer, {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }]}
          />
        </Animated.View>
      )}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[styles.modalHeader, {
                opacity: modalHeaderOpacity,
                transform: [{ scale: modalHeaderScale }]
              }]}
            >
              <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                style={styles.modalIconBg}
              >
                <MaterialIcons name="verified" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.modalTitle}>Welcome to NewsFlash</Text>
            </Animated.View>

            <Animated.View
              style={[styles.modalContent, {
                opacity: modalContentOpacity,
                transform: [{ translateY: modalContentTranslateY }]
              }]}
            >
              <View style={styles.modalFeature}>
                <LinearGradient
                  colors={['#4F46E5', '#818CF8']}
                  style={styles.featureIcon}
                >
                  <MaterialIcons name="article" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Latest News</Text>
                  <Text style={styles.featureDescription}>
                    Get the latest news from trusted sources around the world.
                  </Text>
                </View>
              </View>

              <View style={styles.modalFeature}>
                <LinearGradient
                  colors={['#4F46E5', '#818CF8']}
                  style={styles.featureIcon}
                >
                  <MaterialIcons name="bookmark" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Save for Later</Text>
                  <Text style={styles.featureDescription}>
                    Bookmark articles to read later, even offline.
                  </Text>
                </View>
              </View>

              <View style={styles.modalFeature}>
                <LinearGradient
                  colors={['#4F46E5', '#818CF8']}
                  style={styles.featureIcon}
                >
                  <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Stay Updated</Text>
                  <Text style={styles.featureDescription}>
                    Get notified about breaking news and important updates.
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={{
                opacity: continueButtonOpacity,
                transform: [{ translateY: continueButtonTranslateY }]
              }}
            >
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <FontAwesome6 name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    fontFamily: 'InterBold',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    height: '60%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  logoIcon: {
    marginRight: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 12,
    fontFamily: 'InterBold',
    letterSpacing: 1,
  },
  headingText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'InterRegular',
    lineHeight: 40,
  },
  subContentText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: 'InterMedium',
    fontWeight: '700',
  },
  bottomContainer: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    fontFamily: 'InterMedium',
  },
  termsText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'InterMedium',
    paddingHorizontal: 20,
    lineHeight: 18,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalView: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'InterBold',
    fontWeight: '700',
  },
  modalContent: {
    width: '100%',
    marginBottom: 24,
  },
  modalFeature: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'InterMedium',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'InterMedium',
    fontWeight: '700',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    fontFamily: 'InterMedium',
  },
  // Removed duplicate styles that were already defined above
});
