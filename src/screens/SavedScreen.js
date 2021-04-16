import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { executeQuery } from "../utils/sqlConfig";

const SavedScreen = ({ navigation }) => {
  const [savedShows, setSavedShows] = useState([]);

  useEffect(() => {
    executeQuery("SELECT * FROM table_shows", [])
      .then(res => {
        getShows(res);
        console.log(res.rows.raw());
      })
      .catch(err => {
        console.error(err);
      });
  });

  const getShows = results => {
    if (results !== undefined) {
      const rows = results.rows;
      const shows = [];
      if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          const item = rows.item(i);
          const show = {
            id: item.show_id,
            name: item.show_name,
            image: item.show_image
          };
          shows.push(show);
        }
      }
      setSavedShows(shows);
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View
          style={{
            flex: 0.5,
            flexDirection: "column",
            margin: 1
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Details", {
                itemId: item.id.toString()
              })
            }
          >
            <Image
              style={styles.imageThumbnail}
              source={{
                uri: item.image
              }}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [savedShows]
  );

  const keyExtractor = useCallback(item => item.id.toString(), [savedShows]);

  const listEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>Seems you haven't saved anything yet</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedShows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        ListEmptyComponent={listEmptyComponent()}
      />
    </View>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 40
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  headerView: {
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: 300,
    height: 40,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 25,
    fontSize: 16
  },
  imageThumbnail: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 250
  }
});
