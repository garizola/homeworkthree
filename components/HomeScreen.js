import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import {
  Appbar,
  List,
  PaperProvider,
  Portal,
  Modal,
  Button,
  TextInput,
  IconButton,
} from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  //itemName should be the 'listName' lol
  const [itemName, setListName] = useState("");
  const [lists, setLists] = useState([]);
  const containerStyle = {
    backgroundColor: "#ccc5b9",
    padding: 20,
  };

  useEffect(() => {
    //loads on mount
    loadLists();
  }, []);

  //save lists store the array of lists
  const saveLists = async (newLists) => {
    try {
      //setting the array 'lists' with the new param passed in which is an array of lists.
      await AsyncStorage.setItem("lists", JSON.stringify(newLists));
    } catch (error) {
      console.error(error);
    }
  };

  //load in lists is getting the array lists which has been stringified.
  const loadLists = async () => {
    try {
      //pretty simple here
      const storedLists = await AsyncStorage.getItem("lists");
      if (storedLists) {
        //setting the lists array to a normal array of objects that was previously a stringified so now we can use it like before
        setLists(JSON.parse(storedLists));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = () => {
    hideModal();
    //same newList but updated the list with the spread operator and the 'new list'
    const newList = { name: itemName, items: [] };
    const updatedLists = [...lists, newList];
    //set the updated lists into lists... have to do this so it shows on the app once its added. its reading lists.
    setLists(updatedLists);
    saveLists(updatedLists);
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="List App"
          titleStyle={{ color: "#ccc5b9", fontWeight: "bold" }}
        />
        <Appbar.Action
          icon="plus-circle-outline"
          color="#eb5e28"
          onPress={showModal}
        />
      </Appbar.Header>
      <View style={styles.itemsContainer}>
        {lists.map((list, index) => (
          <List.Item
            style={styles.item}
            titleStyle={{ color: "#ccc5b9", fontWeight: "bold" }}
            key={index}
            title={list.name}
            onPress={() => navigation.navigate("DetailListScreen", list)}
            right={(props) => (
              <IconButton
                icon="delete"
                color="#ccc5b9"
                size={20}
                onPress={() => {
                  const updatedLists = lists.filter((list, i) => i !== index);
                  setLists(updatedLists);
                  saveLists(updatedLists);
                }}
              />
            )}
          />
        ))}
      </View>

      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <Text style={styles.modalText}>Add a list</Text>
        <TextInput
          label="Type your list name here"
          style={styles.textInput}
          onChangeText={setListName}
        />
        <View style={styles.btns}>
          <Button style={styles.btn} mode="contained" onPress={hideModal}>
            Cancel
          </Button>
          <Button style={styles.btn} mode="contained" onPress={addItem}>
            Add New List
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc5b9",
    width: "100%",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#252422",
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    maxWidth: "600px",
  },
  textInput: {
    maxWidth: "600px",
  },
  btn: {
    backgroundColor: "#252422",
  },
  modalText: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  item: {
    width: "97%",
    margin: "0 auto",
    backgroundColor: "#403d39",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
    borderRadius: 4,
  },
});
