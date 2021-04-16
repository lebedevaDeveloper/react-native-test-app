import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import SavedScreen from "./screens/SavedScreen";
import SplashScreen from "./screens/SplashScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import rootReducer from "./reducers";

const client = axios.create({
  baseURL: "http://api.tvmaze.com/",
  responseType: "json"
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = createStore(
  rootReducer,
  applyMiddleware(axiosMiddleware(client))
);

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Saved" component={SavedScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
