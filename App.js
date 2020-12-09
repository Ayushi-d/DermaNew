import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNav from './src/navigator/rootNav';
import {Provider} from 'react-native-paper';

export default App = () => (
  <Provider>
    <NavigationContainer>
      <RootNav />
    </NavigationContainer>
  </Provider>
);
