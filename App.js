import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNav from './src/navigator/rootNav';
import {DefaultTheme, Provider} from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default App = () => (
  <Provider theme={theme}>
    <NavigationContainer>
      <RootNav />
    </NavigationContainer>
  </Provider>
);
