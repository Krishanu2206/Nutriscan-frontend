import {View, Text} from 'react-native';
import React from 'react';
import { Authprovider } from './context/authcontext';
import Screenmenu from './components/screenmenu';
import { Postprovider } from './context/postcontext';

const Rootnavigation= ()=> {
    return (
        <Authprovider>
            <Postprovider>
                <Screenmenu />
            </Postprovider>
        </Authprovider>
    );
};

export default Rootnavigation;