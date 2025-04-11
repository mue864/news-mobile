import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import NewsContext, { NewsProvider } from "../data/NewsProvider";

export default function NewsRouter() {
  return (
    <NewsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#B91C1C",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Headlines",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="newspaper"
                size={30}
                color={focused ? "#B91C1C" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sport"
          options={{
            title: "Sports",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="volleyball"
                size={25}
                color={focused ? "#B91C1C" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="tech"
          options={{
            title: "Technology",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="laptop"
                size={25}
                color={focused ? "#B91C1C" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="local"
          options={{
            title: "Local News",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="location-dot"
                size={27}
                color={focused ? "#B91C1C" : "gray"}
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
                color={focused ? "#B91C1C" : "gray"}
              />
            ),
          }}
        />
      </Tabs>
    </NewsProvider>
  );
}
