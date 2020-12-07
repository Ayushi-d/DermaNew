import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNav from './src/navigator/rootNav';

export default (App = () => <NavigationContainer><RootNav /></NavigationContainer>);
