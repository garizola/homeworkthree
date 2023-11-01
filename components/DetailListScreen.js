import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Appbar,
  Modal,
  TextInput,
  Button,
  List,
  IconButton,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailListScreen({ navigation, route }) {
  let listObj = route.params;
  const [visible, setVisible] = useState();
  const [itemName, setItemName] = useState();
  const [listOfItems, setListOfItems] = useState([]);
  const containerStyle = { backgroundColor: '#ccc5b9', padding: 20 };

  useEffect(() => {
    loadListItems();
  }, []);

  //pretty much same thing here... however we have to determine what list we are on. To do this we have to use backticks and get the name of the listObj as the unique key. 
  const saveListItems = async (items) => {
    try {
      await AsyncStorage.setItem(`listItems:${listObj.name}`, JSON.stringify(items));
    } catch (error) {
      console.error( error);
    }
  };

  const loadListItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem(`listItems:${listObj.name}`);
      if (storedItems) {
        setListOfItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const addItem = () => {
    hideModal();
    const newItem = { itemName };
    listObj.items.push(newItem);
    setListOfItems([...listOfItems, newItem]);
    saveListItems(listObj.items);
  };

  const deleteItem = (item) => {
    console.log('delete', item);

    listObj.items = listObj.items.filter((a) => a.itemName !== item.itemName);
    setListOfItems(listObj.items);
    saveListItems(listObj.items);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => navigation.navigate('Home')}
          color="#eb5e28"
        />
        <Appbar.Content title={listObj.name}  titleStyle={{color: "#ccc5b9", fontWeight: 'bold'}}/>
        <Appbar.Action icon="plus-circle-outline" onPress={showModal} color="#eb5e28"/>
      </Appbar.Header>
      <View style={styles.itemsContainer}>
        {listOfItems.map((item, index) => (
          <List.Item
            style={styles.item}
            key={index}
            title={item.itemName}
            titleStyle={{color: "#ccc5b9", fontWeight: 'bold'}}
            right={(props) => (
              <IconButton
                icon="delete"
                color="#ccc5b9"
                size={20}
                onPress={() => {
                  deleteItem(item);
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
        <Text style={styles.modalText}>Add an item</Text>
        <TextInput
          label="Type your item here.."
          style={styles.textInput}
          onChangeText={setItemName}
        />
        <View style={styles.btns}> 
        <Button mode="contained" style={styles.btn} onPress={hideModal}>Cancel</Button>
        <Button mode="contained" style={styles.btn} onPress={addItem}>Add New Item</Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
    backgroundColor: '#ccc5b9',
  },
 
  header: {
    backgroundColor: "#252422",
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  }, 
  btn: {
    backgroundColor: '#252422'
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center'
  },
  modalText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  item: {
    width: '97%',
    margin: '0 auto',
    backgroundColor: '#403d39',
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 6, 
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
    borderRadius: 4
  },
});