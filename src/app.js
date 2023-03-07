import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { LogBox, Platform, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import LoginScreen from "./components/auth/login.js";
import SignupScreen from "./components/auth/signup.js";

import ForgotPasswordScreen from "./components/forgot_password.js";
import Isloading from "./components/isloading.js";

import { navigationRef } from "./navigation/navigationRef.js";
import { store } from "./store";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from "react-native-root-siblings";
import Fonts from "../fonts/index.js";
import { Settings } from "react-native-fbsdk-next";
Settings.initializeSDK();

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs(true);

const AppContainer = (props) => {
  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener("state", (e) => {
      console.log(
        "Current Screen :",
        navigationRef.current.getCurrentRoute().name
      );
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        colors: {
          background: "rgba(255,255,255,0.95)",
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={Isloading} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <>
      <StatusBar hidden={false} style={"dark"} />
      <Provider store={store}>
        <RootSiblingParent>
          <AppContainer />
          <FlashMessage
            position="bottom"
            floating={true}
            titleStyle={{
              fontFamily: Fonts.regular,
            }}
            duration={3000}
          />
        </RootSiblingParent>
      </Provider>
    </>
  );
};

export default App;
