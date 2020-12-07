import React from 'react';
import {View, Text, StyleSheet, Settings} from 'react-native';

export default class Msgr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <View style={styles.container}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
