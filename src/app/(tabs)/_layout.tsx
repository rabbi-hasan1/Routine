import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { ScheduleProvider } from "../context/ScheduleContext";

const BLUE = "#1877F2";
const GRAY = "#65676B";

const tabs = [
  { name: "index", title: "Home", icon: "home-outline", activeIcon: "home" },
  {
    name: "week",
    title: "Week",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    name: "task",
    title: "Task",
    icon: "checkbox-outline",
    activeIcon: "checkbox",
  },
];

export default function TabLayout() {
  return (
    <>
      <ScheduleProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: BLUE,
            tabBarInactiveTintColor: GRAY,
            animation: "shift",
            headerPressColor: "#0a3296",

            tabBarStyle: {
              height: 50,
              backgroundColor: "#FFFFFF",
              borderTopWidth: 1,
              borderTopColor: "#E4E6EB",
              paddingTop: 5,
              paddingBottom: 5,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.title,
                tabBarBadge: tab.name === "notifications" ? 3 : undefined,
                tabBarIcon: ({ focused, color }) => (
                  <View style={{ alignItems: "center" }}>
                    <Ionicons
                      name={(focused ? tab.activeIcon : tab.icon) as any}
                      size={27}
                      color={color}
                    />
                  </View>
                ),
              }}
            />
          ))}
        </Tabs>
      </ScheduleProvider>
    </>
  );
}
