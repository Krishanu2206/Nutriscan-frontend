import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import FooterMenu from '../components/menus/footermenu';
import { authcontext } from '../context/authcontext';
import {postcontext} from '../context/postcontext';

const Myposts = ({navigation}) => {
    // Global state
    const [state, setstate] = useContext(authcontext);
    const [posts, setposts, getallposts] = useContext(postcontext);

    // Local state
    const [userposts, setuserposts] = useState([]);

    useEffect(() => {
        // Fetch user posts when component mounts
        getuserposts();
    }, []);

    const getuserposts = async () => {
        try {
            const token = state?.token;
            const res = await fetch("http://192.168.0.104:8080/api/v1/post/getuserpost", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const result = await res.json();
            setuserposts(result.userposts);

        } catch (error) {
            console.log(error);
            return Alert.alert(`Error : ${error.message}`);
        }
    };

    //deleting user post
    const handleDelete = async (postId) => {
        try {
            const token = state?.token;
            const res = await fetch(`http://192.168.0.104:8080/api/v1/post/deletepost/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const result = res.json();
    
            if (result.success == false) {
                return Alert.alert(result.message);
            }
            getallposts();
            navigation.push('Myposts');
            return Alert.alert("Review deleted successfully");
    
        } catch (error) {
            console.log(error);
            Alert.alert(`Error : ${error.message}`);
        }
    };

    //Render each user post item
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)} // Pass post ID to delete function
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.heading}>MY REVIEWS</Text>
                <FlatList
                    data={userposts}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.flatListContent}
                />
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
        flex: 1,
        alignItems: 'center',
        width: '100%',
        paddingTop : 20
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        width: 350 ,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        marginBottom: 5,
    },
    flatListContent: {
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5, // Adjust padding to make the button smaller
        borderRadius: 5,
        position: 'absolute', // Position the button absolutely
        bottom: 5, // Position the button 5 units from the bottom
        right: 5, // Position the button 5 units from the right
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12, // Adjust font size to make the text smaller
    },
});

export default Myposts;
