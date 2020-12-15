import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../Headers/SettingsHeader';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{...styles.container}}>
        <Header title={'Better Matches'} {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
