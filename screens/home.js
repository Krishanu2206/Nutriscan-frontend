import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import { authcontext } from '../context/authcontext';
import {postcontext} from '../context/postcontext';
import FooterMenu from '../components/menus/footermenu';
import Postcard from '../components/menus/postcard';

const Home = () => {
    //global state
    const [state] = useContext(authcontext);
    const [posts, setposts, getallposts] = useContext(postcontext);
    const [refreshing, setrefreshing] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>ALL REVIEWS</Text>
                <Postcard/>
{/*                 <Text>{JSON.stringify(posts, null, 4)}</Text> */}
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
        paddingTop: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Home;
