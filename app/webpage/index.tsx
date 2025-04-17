
import {SafeAreaView, TouchableOpacity, Text, StyleSheet, Platform, StatusBar, ActivityIndicator, View } from "react-native";
import {WebView} from 'react-native-webview';
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useState } from "react";

const WebPage = () => {
    const router = useRouter();
    const {url} = useLocalSearchParams();
    const [loading, setLoading] = useState(true)
    return (
      <>
       <SafeAreaView>
        
       </SafeAreaView>
        <Stack.Screen options={{ title: "Reading...", headerShown: true, animation: 'fade' }} />
        {loading && (
          <View>
            <ActivityIndicator size={"large"} color="#0096FF" />
          </View>
        )}

        <WebView
          source={{ uri: String(url) }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1 }}
        />

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        )}
      </>
    );
}
 
export default WebPage;

const styles = StyleSheet.create({
  goBackBtn: {
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#EE4B2B",
    borderRadius: 50,
    padding: 10,
    width: 90,
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },
});