import React, { useState, useEffect } from "react";
import { executeQuery } from "../utils/sqlConfig";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { getDetails } from "../reducers/detailsReducer";

const DetailsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [color, setColor] = useState("gray");
  const [saved, setSaved] = useState(false);

  const { details, loading } = useSelector((state) => ({
    details: state.details.details,
    loading: state.details.detailsLoading
  }));

  useEffect(() => {
    if (route.params?.itemId) {
      // check if show is saved
      executeQuery("SELECT * FROM table_shows where show_id = ?", [
        route.params?.itemId
      ])
        .then((res) => {
          processShow(res);
          console.log(res.rows.raw());
        })
        .catch((err) => {
          console.error(err);
        });

      // fetch details
      dispatch(getDetails(route.params?.itemId));
    }
  }, []);

  // checks db results and sets saved status
  const processShow = (results) => {
    const len = results.rows.length;
    if (len > 0) {
      results.rows.item(0);
      setSaved(true);
      setColor("orange");
    } else {
      setSaved(false);
      setColor("grey");
    }
  };

  const getImageResource = (image) => {
    if (image === null || image === undefined) return "";

    if (image.medium !== null && image.medium !== undefined)
      return image.medium;

    if (image.original !== null && image.original !== undefined)
      return image.original;

    return "";
  };

  const changeSaved = () => {
    if (saved) {
      removeShowFromSaved();
    } else {
      saveShow();
    }
  };

  const saveShow = async () => {
    setSaved(true);
    setColor("orange");
    executeQuery(
      "INSERT INTO table_shows (show_id, show_name, show_image) VALUES (?,?,?)",
      [details.id, details.name, getImageResource(details.image)]
    )
      .then((res) => {
        console.log(res.rows.raw());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const removeShowFromSaved = async () => {
    setSaved(false);
    setColor("grey");
    executeQuery("DELETE FROM  table_shows where show_id=?", [details.id])
      .then((res) => {
        console.log(res.rows.raw());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image
          style={styles.cover}
          source={{
            uri: getImageResource(details.image)
          }}
        />
        <View style={{ marginHorizontal: 8 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.name}>
              {details.name !== null ? details.name : ""}
            </Text>
          </View>
          <Text style={styles.text}>{`Language: ${details.language}`}</Text>
          <Text style={styles.text}>{`Status: ${details.status}`}</Text>
          <Text style={styles.text}>{`Premiered: ${details.premiered}`}</Text>
          <Text style={styles.text}>Genres:</Text>
          <FlatList
            data={details.genres}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Text style={[styles.text]}>{item}</Text>}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.round, { backgroundColor: color }]}
        onPress={() => changeSaved(true)}
      >
        <Text style={styles.saveText}>{saved ? "Saved" : "Save"}</Text>
      </TouchableOpacity>

      <Text style={styles.description}>
        {details.summary !== null && details.summary !== undefined
          ? details.summary.replace(/<\/?[^>]+(>|$)/g, "")
          : ""}
      </Text>
    </View>
  );
};

export default DetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  infoContainer: {
    flexDirection: "row",
    marginHorizontal: 10
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
  cover: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 180,
    height: 250
  },

  name: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
    flexShrink: 1,
    flex: 1
  },

  text: {
    color: "black",
    fontSize: 15
  },
  description: {
    marginTop: 20,
    marginHorizontal: 10
  },

  round: {
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    height: 50,
    marginTop: 40,
    borderRadius: 50
  },
  saveText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  }
});
