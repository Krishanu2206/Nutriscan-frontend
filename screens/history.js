import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import FooterMenu from '../components/menus/footermenu';
import { authcontext } from '../context/authcontext';

const History = ({navigation}) => {
  // Global state
  const [state, setstate] = useContext(authcontext);

  // Local state
  const [history, setuserhistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedproduct, setselectedproduct] = useState("Select product");
  const token = state?.token;

  useEffect(() => {
    // Fetch user history when component mounts
    getuserhistory();
  }, []);

  const getuserhistory = async () => {
    try {
      const res = await fetch("https://nutriscan-backend.onrender.com/api/v1/history/gethistory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const result = await res.json();
      setuserhistory(result.userhistory);

    } catch (error) {
      console.log(error);
      Alert.alert(`Error: ${error.message}`);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.productname}</Text>
        <Image 
            source={{
                uri: item && item.imageurl
            }}
            style={styles.image}
        />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => openModal(item)}
        >
            <Text style={styles.seeMoreButtonText}>See More</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handledelete(item._id)}
        >
            <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handledelete = async(productId) => {
    try{
    const deleteresponse = await fetch(`https://nutriscan-backend.onrender.com/api/v1/history/deletehistory/${productId}`, {
        method : "DELETE",
        headers : {
            'Content-Type' : "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const deletedresult = await deleteresponse.json();
    if(deletedresult.success == false){
        return Alert.alert(deletedresult.message);
    }
    navigation.push('History');
    Alert.alert("HISTORY DELETED SUCCESSFULLY");
    }
    catch(error){
        console.log(error);
        return Alert.alert(`ERROR IN deleting : ${error.message}`);
    }
  } 

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>MY HISTORY</Text>
        <FlatList
          data={history}
          renderItem={renderCard}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.flatListContent}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem && selectedItem.productname}</Text>
              <Text style={styles.modalTitle}>Brand: {selectedItem && selectedItem.brands}</Text>
              <Text>DETAILED ANALYSIS</Text>
              {selectedItem && selectedItem.nutriments.map((nutriment, index) => (
                <ScrollView key={index}>
                  <Text>{nutriment.name}: {nutriment.value}</Text>
                </ScrollView>
              ))}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </Modal>
      </View>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  seeMoreButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  seeMoreButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Align buttons at the ends of the container
    marginTop: 10, // Add margin from the top
  },  
  deleteButton: {
    backgroundColor: 'red', // Set button background color to red
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginLeft : 100 // Align the button to the right
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },  
  image: {
    width: 100, // Adjust the width and height as needed
    height: 100,
  },
  heading: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20, 
    textAlign: 'center', 
  },
});

export default History;
