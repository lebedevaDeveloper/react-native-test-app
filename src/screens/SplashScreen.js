import React, { useState, useEffect } from "react";
import SQLite from "react-native-sqlite-storage";
import { executeQuery } from "../utils/sqlConfig";
import { Alert } from "react-native";
import { View, Text, StyleSheet, ImageBackground, Animated } from "react-native";

const SplashScreen = ({ navigation }) => {
  const [textOpacityAnimation] = useState(new Animated.Value(0));

  // opens db and crestes a table of shows for saving feature
  const openDataBase = async () => {
    const openCB = async () => {
      try {
        console.log("Database OPENED");
        const result = await executeQuery(
          "CREATE TABLE IF NOT EXISTS table_shows(show_id INTEGER PRIMARY KEY AUTOINCREMENT, show_name VARCHAR(20), show_image TEXT)",
          []
        );
        console.log(result.rows.raw());
        navigation.replace("Home");
      } catch (e) {
        console.log(e);
        Alert.alert("Error on openning db", e.message);
      }
    };

    const errorCB = (err) => console.log("SQL " + err);

    global.db = SQLite.openDatabase(
      "showsDB",
      "1.0",
      "TVMazeDB",
      200000,
      openCB,
      errorCB
    );
  };

  useEffect(() => {
    const navTimeout = setTimeout(() => openDataBase(), 2000);

    Animated.timing(textOpacityAnimation, {
      toValue: 1,
      delay: 800,
      duration: 1000,
      useNativeDriver: "false"
    }).start();

    return () => {
      clearTimeout(navTimeout);
    };
  }, []);

  return (
    <ImageBackground
      source={require("../assets/splashBackground.jpg")}
      style={styles.background}
    >
      <View style={[styles.container]}>
        <Text style={styles.logo}>ShowDive</Text>
        <Animated.View style={{ opacity: textOpacityAnimation }}>
          <Text style={styles.text}>
            Search for tv shows. Find something you like.
          </Text>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%"
  },
  logo: {
    fontSize: 50,
    color: "yellow",
    textAlign: "left",
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: "15%"
  },
  text: {
    color: "white",
    fontSize: 15
  },

  container: {
    justifyContent: "flex-start",
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    marginHorizontal: 40
  }
});
