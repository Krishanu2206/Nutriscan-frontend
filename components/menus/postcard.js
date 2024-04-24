import { Text, View, FlatList, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { postcontext } from '../../context/postcontext';

const Postcard = () => {
    // Global state
    const [posts, setposts] = useContext(postcontext);

    // Render each post item
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.author}>Posted by: {item.author.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.totalPosts}>TOTAL REVIEWS : {posts.length}</Text>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalPosts: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue', // Adjust color as needed
        marginBottom: 20,
    },
    flatListContent: {
        alignItems: 'center',
    },
    card: {
        width: 350,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft : 15,
        paddingRight: 15,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        marginBottom: 10,
    },
    author: {
        fontStyle: 'italic',
    },
});

export default Postcard;
