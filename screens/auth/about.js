import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import FooterMenu from '../../components/menus/footermenu';


const About = ()=> {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
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
});


export default About;