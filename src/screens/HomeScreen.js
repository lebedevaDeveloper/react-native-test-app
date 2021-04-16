import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { listShows } from "../reducers/homeReducer";
import { executeQuery } from "../utils/sqlConfig";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { shows, loading, error } = useSelector(state => ({
    shows: state.home.shows,
    loading: state.home.loading,
    error: state.home.error
  }));

  useEffect(() => {
    // fetching the list of shows on start
    dispatch(listShows("a"));
  }, []);

  const renderHeader = func => (
    <View style={styles.headerView}>
      <TextInput
        style={styles.input}
        placeholder="Search something here"
        textStyle={{ color: "#000" }}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={func}
      />
    </View>
  );

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    dispatch(listShows(formattedQuery));
  };

  const getImageResource = image => {
    if (image === null) return "";

    if (image.medium !== null) return image.medium;

    if (image.original !== null) return image.original;

    return "";
  };

  const navigateToDetails = (id) => {
    navigation.navigate("Details", { itemId: id });
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View
          style={{
            flex: 0.5,
            flexDirection: "column",
            margin: 1
          }}>
          <TouchableOpacity onPress={() => navigateToDetails(item.show.id.toString())}>
            <Image
              style={styles.imageThumbnail}
              source={{ uri: getImageResource(item.show.image) }} />
          </TouchableOpacity>
        </View>
      );
    }, [shows]);

  const keyExtractor = useCallback(item => item.show.id.toString(), [shows]);

  const listEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text>Nothing found, sorry :(</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={shows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent()}
        ListHeaderComponent={renderHeader(val => handleSearch(val))}
        numColumns={2}
      />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator
            animating={loading}
            color="yellow"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

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
