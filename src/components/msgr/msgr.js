import React from 'react';
import {View, Text, StyleSheet, Settings} from 'react-native';
import MsgHeader from '../Headers/msgHeader';
import MsgBox from './msgBox';

export default class Msgr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    let {params} = this.props.route;
    let oUser = params.data.otheruser;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={styles.container}>
        <MsgHeader title={'Nitish Sharma'} {...this.props} />
        <View style={{flex: 1}}></View>
        <MsgBox {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
