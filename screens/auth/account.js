import { View, Text, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { authcontext } from '../../context/authcontext';
import FooterMenu from '../../components/menus/footermenu';

const Account = () => {
    //global state
    const [state] = useContext(authcontext);
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>Name : {state?.user.name}</Text>
                <Text>Email : {state?.user.email}</Text>
                <Text>Role : {state?.user.role}</Text>
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
        padding : 10,
        paddingTop : 40,
        alignItems : "center",
        width: '100%',
    },
});

export default Account;