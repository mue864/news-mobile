import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import NewsContext, { NewsProvider } from "../data/NewsProvider";

export default function NewsRouter() {
  return (
    <NewsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="house"
                size={25}
                color={focused ? "#3B82F6" : "gray"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bookmarks"
          options={{
            title: "Bookmarks",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="bookmark"
                size={25}
                color={focused ? "#3B82F6" : "gray"}
                solid={focused}
              />
            ),
          }}
        />
      </Tabs>
    </NewsProvider>
  );
}
