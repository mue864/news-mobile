
import {SafeAreaView, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import {WebView} from 'react-native-webview';
import { useRouter, useLocalSearchParams } from "expo-router";

const WebPage = () => {
    const router = useRouter();
    const {url} = useLocalSearchParams();
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView source={{ uri: String(url) }} style={{ flex: 1 }} />
       {Platform.OS === 'ios' ? (
        <TouchableOpacity 
        style={styles.goBackBtn}
        onPress={() => router.back()}>
          <Text style={styles.text}>Go Back</Text>
        </TouchableOpacity>
       ): (
        <TouchableOpacity></TouchableOpacity>
       )}
       
      </SafeAreaView>
    );
}
 
export default WebPage;

const styles = StyleSheet.create({
  goBackBtn: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#0096FF",
  },
});