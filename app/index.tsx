import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import {MaterialIcons} from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function Index() {
  const [isModalVisible, setModalVisible] = useState(false);
  const route = useRouter();

  // getting the height and width
  const screenWidth = Dimensions.get('window').width;
  const screemHeight = Dimensions.get("window").height;
  
  const [fontsLoaded] = useFonts({
    "Roboto": require("../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
    "Monsterrat": require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Image
        source={require("../assets/images/paper.jpg")}
        style={[styles.hero, { width: screenWidth }]}
        resizeMode="cover"
      />
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeading}>
              Stay updated with stories that matter to you
            </Text>
            <View style={styles.modalSubInfo}>
              <MaterialIcons name="check" size={20} color="#374151" />
              <Text style={styles.modalSubText}>
                Get the latest breaking news, trending topics, and local updates
                — all in one place.
              </Text>
            </View>
            <View style={styles.modalSubInfo}>
              <MaterialIcons name="notifications" size={20} color="#374151" />
              <Text style={styles.modalSubText}>
                Receive optional notifications for categories you care about.
              </Text>
            </View>

            <View style={styles.modalSubInfo}>
              <MaterialIcons name="category" size={20} color="#374151" />
              <Text style={styles.modalSubText}>
                Choose from any category you love to read from.
              </Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false),
                route.replace("./news")
              }}
            >
              <Text style={styles.closeButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomContainer}>
        <Text style={styles.headingText}>Your One Stop for all news</Text>
        <Text style={styles.subHeadingText}>
          By Clicking Get Started, You Agree to Our Terms.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 300,
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingVertical: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
  },
  headingText: {
    color: "#374151",
    fontFamily: "Monsterrat",
    fontWeight: 700,
    fontSize: 30,
    textAlign: "center",
    marginTop: 30,
  },
  subHeadingText: {
    textAlign: "center",
    color: "#374151",
    marginTop: 8,
  },
  hero: {
    height: 650,
    zIndex: -10,
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.1)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  closeButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#1E293B",
    borderRadius: 15,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: '500'
  },
  modalSubInfo: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubText: {
    fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 14,
    color: "#374151",
  },
  modalHeading: {
    fontFamily: "Roboto",
    fontSize: 20,
    color: "#374151",
    fontWeight: "700",
    textAlign: "center",
  },
});
