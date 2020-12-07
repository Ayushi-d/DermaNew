import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../Headers/SettingsHeader';

export default class ChatRqsts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={'CHAT REQUESTS'} {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
