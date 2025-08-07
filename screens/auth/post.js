import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { authcontext } from "../../context/authcontext";
import FooterMenu from '../../components/menus/footermenu';
import { postcontext } from '../../context/postcontext';

const Post = ({ navigation }) => {
    const [state, setState] = useContext(authcontext);
    const [posts, setposts, getallposts] = useContext(postcontext);
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [loading, setloading] = useState(false);
    const [history, setuserhistory] = useState([]);
    const [selectedproduct, setselectedproduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getuserhistory = async () => {
        try {
            const token = state?.token;
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

    useEffect(() => {
        getuserhistory();
    }, []);

    const handlepost = async () => {
        try {
            setloading(true);
            if (!title || !description) {
                return Alert.alert("Please fill all fields")
            }
            const requestbody = {
                title: title,
                description: description
            }
            const token = state?.token;
            const res = await fetch("https://nutriscan-backend.onrender.com/api/v1/post/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestbody),
            });
            const result = await res.json();
            if (result.success == false) {
                setloading(false);
                return Alert.alert(result.message);
            }
            if (result.success == true) {
                setloading(false);
                navigation.navigate('Home');
                console.log(result.newpost);
                getallposts();
                return Alert.alert(result.message);
            }
        } catch (error) {
            setloading(false);
            console.log(error);
            return Alert.alert(error.message);
        }
    }

    const handlechooseproduct = () => {
        setModalVisible(true);
    }

    const handlechosenproduct = (productname) => {
        console.log(productname);
        settitle(productname);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.createpost}>
                    <Text style={styles.heading}>Post a Review</Text>
                    <TextInput style={styles.inputbox} placeholder='Select product from below' placeholderTextColor={"gray"}
                        value={title} onChangeText={(text) => settitle(text)} />
                    <TouchableOpacity style={styles.chooseProductBtn} onPress={handlechooseproduct}>
                        <Text style={styles.chooseProductBtnText}>Choose Product</Text>
                    </TouchableOpacity>
                    <TextInput style={styles.inputbox} placeholder='Enter your review on the product' placeholderTextColor={"gray"}
                        multiline={true} numberOfLines={6} value={description} onChangeText={(text) => setdescription(text)} />
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity style={styles.postbtn} onPress={handlepost}>
                        <Text style={styles.postbtntext}>Post</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ScrollView>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeading}>Choose Product for Review</Text>
                        {history.map((item) => (
                            <TouchableOpacity key={item._id} onPress={() => handlechosenproduct(item.productname)}>
                                <Text style={styles.productItem}>{item.productname}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeModalBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>
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
    heading: {
        fontSize: 25,
        fontWeight: "bold"
    },
    createpost: {
        alignItems: "center",
        padding: 20
    },
    inputbox: {
        width: 320,
        marginTop: 30,
        textAlignVertical: "top",
        fontSize: 16,
        padding: 15,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 20
    },
    postbtn: {
        backgroundColor: 'black',
        width: 300,
        marginTop: 30,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    postbtntext: {
        color: "white",
    },
    chooseProductBtn: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    chooseProductBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productItem: {
        fontSize: 16,
        paddingVertical: 10,
    },
    closeModalBtn: {
        marginTop: 20,
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeModalBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Post;
