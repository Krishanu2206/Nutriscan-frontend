import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, Modal, FlatList, Image } from 'react-native';
import FooterMenu from '../components/menus/footermenu';
import { authcontext } from "../context/authcontext";

export default function Scan() {
  //global state
  const [state, setstate] = useContext(authcontext);

  //local state
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, hasScanned] = useState(false);
  const [info, setinfo] = useState("");
  const [finalresult, setfinalresult] = useState({});
  const [isModalvisible, setisModalvisible] = useState(false);
  const [nutrimentsArray, setnutrimentsArray] = useState([]);
  const [nutriscoreArray, setnutriscore] = useState([]);
  const [isnutriscorevisible, setisnutriscorevisible] = useState(false);
  const [islabelsmodalvisible, setislabelsmodalvisible] = useState(false);
  const [labels, setlabels] = useState([]);
  const [nutrientlevels, setnutrientlevels] = useState([]);
  const [isnutrientlevelsmodalvisible, setisnutrientlevelsmodalvisible] = useState(false);
  const [productimage, setproductimage] = useState(null);

  const askforpermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }
  useEffect(() => {
    askforpermissions();
  }, []);

  const getdatainfo = async () => {
    try {
      const token = state?.token;

      const requestbody = {
        code:  info //"7622210449283"//"8901012100882"
      };

      const verifycode = await fetch("https://nutriscan-backend.onrender.com/api/v1/history/verify", {
        method : 'POST',
        headers : {
          'Content-Type' : "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body : JSON.stringify(requestbody)
      });

      const isverified = await verifycode.json();
      if(isverified.success == false){
        return Alert.alert(`${isverified.message}`);
      };
      if(isverified.success == true){
        console.log(`${isverified.message}`);
      }

      const response = await fetch("https://food-info-84w7.onrender.com/product_info", {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestbody)
      });

      const result = await response.json();

      if(result.product_name == "NO INFO FOUND"){
        return Alert.alert("No info found on this product!");
      }

      setlabels(result.labels);
      setfinalresult(result);
      setisModalvisible(true);
      setnutrimentsArray(Object.entries(result.nutriments).map(([key, value]) => ({
        name: key,
        value
      })));

      setnutriscore(Object.entries(result.nutriscore_data).map(([key, value]) => ({
        name: key,
        value
      })));

      setnutrientlevels(Object.entries(result.nutrient_levels).map(([key, value]) => ({
        name: key,
        value
      })));

      setproductimage(result.image_url);

      const brands = result.brands? result.brands : "Unknown";
      const productname = result.product_name? result.product_name : "Unknown";
      const imageURL = result.image_url? result.image_url : "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      const barcode = info; // "7622210449283";
      const requestbody2 = {
        brands: brands,
        productname: productname,
        nutriments: Object.entries(result.nutriments).map(([key, value]) => ({ name: key, value })) ,
        imageurl: imageURL,
        code : barcode
      };

      const response2 = await fetch("https://food-info-84w7.onrender.com/api/v1/history/createhistory", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestbody2)
      });

      const result2 = await response2.json();

      if (result2.success == false) {
        return Alert.alert(result2.message);
      }
      console.log(result2.message);
      console.log(result2.newhistory);
    } catch (error) {
      console.log(error);
      return Alert.alert(error.message);
    }
  }

  const handleSeeDetailPress = () => {
    setisnutriscorevisible(!isnutriscorevisible);
  };

  const handleseelabels = () => {
    setislabelsmodalvisible(!islabelsmodalvisible);
  };

  const handleseenutrientlevels = () => {
    setisnutrientlevelsmodalvisible(!isnutrientlevelsmodalvisible);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      hasScanned(true);
      setinfo(data);
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      // You can handle the scanned barcode data here
    }
  };

  const openlink = useCallback(async () => {
    const supported = await Linking.canOpenURL(info);

    if (supported) {
      await Linking.openURL(info);
    } else {
      Alert.alert(`Don't know how to open this URL: ${info}`);
    }
  }, [info]);

  const openimagelink = useCallback(async () => {
    const supported = await Linking.canOpenURL(finalresult["image_url"]);

    if (supported) {
      await Linking.openURL(finalresult["image_url"]);
    } else {
      Alert.alert(`Don't know how to open this URL: ${info}`);
    }
  }, [finalresult["image_url"]]);

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={() => Camera.requestCameraPermissionsAsync()} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} onBarCodeScanned={handleBarCodeScanned}>
        <View style={styles.resultcontainer}>
          <Button title={info} onPress={openlink}></Button>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <Button title="GET RESULT" onPress={getdatainfo}></Button>
      <FooterMenu />
      <Modal visible={isModalvisible} onRequestClose={() => setisModalvisible(false)} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.displayresulttext}>BRAND : {finalresult["brands"]}</Text>
{/*           <Button title={finalresult["image_url"]} onPress={openimagelink}></Button> */}
          <Image
            style={styles.image}
            source={{ uri: `${finalresult["image_url"]}` }}
          />
          <Text style={styles.displayresulttext}>PRODUCT-NAME : {finalresult["product_name"]}</Text>
          <FlatList
            data={nutrimentsArray}
            renderItem={({ item }) => (
              <View style={styles.nutrientItem}>
                <Text style={styles.nutrientName}>{item.name}</Text>
                <Text style={styles.nutrientValue}>{item.value}</Text>
              </View>
            )}
            ListHeaderComponent={
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>NUTRIENTS LIST</Text>
              </View>
            }
            ListFooterComponent={
              <View style={styles.tableFooter}>
                <Text style={styles.footerText}>END OF THE LIST</Text>
              </View>
            }
          />
          <Button title="Show Labels" onPress={handleseelabels} />
          <Button title={isnutrientlevelsmodalvisible ? "HIDE NUTRIENT LEVELS" : "SHOW NUTRIENT LEVELS"} onPress={handleseenutrientlevels} />
          <Button title={isnutriscorevisible ? "SHOW IN BRIEF" : "SHOW IN DETAILS"} onPress={handleSeeDetailPress} />

          <Button title="Close" onPress={() => setisModalvisible(false)} />
        </View>
      </Modal>
      <Modal visible={islabelsmodalvisible} onRequestClose={() => setislabelsmodalvisible(false)} animationType="slide">
        <View style={styles.modalContent}>
          <FlatList
            data={labels}
            renderItem={({ item }) => <Text style={styles.nutrientName}>{item}</Text>}
            ListHeaderComponent={
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>LABELS</Text>
              </View>
            }
          />
          <Button title="Close" onPress={() => setislabelsmodalvisible(false)} />
        </View>
      </Modal>
      <Modal visible={isnutrientlevelsmodalvisible} onRequestClose={() => setisnutrientlevelsmodalvisible(false)} animationType="slide">
        <View style={styles.modalContent}>
          <FlatList
              data={nutrientlevels}
              renderItem={({ item }) => (
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>{item.name}</Text>
                  <Text style={styles.nutrientValue}>{item.value}</Text>
                </View>
              )}
              ListHeaderComponent={
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>NUTRIENT LEVELS</Text>
                </View>
              }
              ListFooterComponent={
                <View style={styles.tableFooter}>
                  <Text style={styles.footerText}>END OF THE LIST</Text>
                </View>
              }
            />
          <Button title="Close" onPress={() => setisnutrientlevelsmodalvisible(false)} />
        </View>
      </Modal>
      <Modal visible={isnutriscorevisible} onRequestClose={() => setisnutriscorevisible(false)} animationType="slide">
        <View style={styles.modalContent}>
          <FlatList
              data={nutriscoreArray}
              renderItem={({ item }) => (
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>{item.name}</Text>
                  <Text style={styles.nutrientValue}>{item.value}</Text>
                </View>
              )}
              ListHeaderComponent={
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>NUTRISCORE DATA LIST</Text>
                </View>
              }
              ListFooterComponent={
                <View style={styles.tableFooter}>
                  <Text style={styles.footerText}>END OF THE LIST</Text>
                </View>
              }
            />
          <Button title="Close" onPress={() => setisnutriscorevisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  resultcontainer: {
    height: 100,
    backgroundColor: 'plum',
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  result: {
    color: "white",
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  displayresulttext: {
    fontSize: 18,
  },
  nutrientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutrientValue: {
    fontSize: 16,
  },
  tableHeader: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableFooter: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
