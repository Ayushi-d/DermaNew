import React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import THEME from '../../config/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class MsgBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _send = () => {};

  render() {
    return (
      <View style={{...styles.container}}>
        <View style={styles.txtInpCon}>
          <TextInput
            placeholder={'Type a message.'}
            placeholderTextColor={'#888'}
            style={styles.txtInp}
            multiline
          />
        </View>
        <Pressable style={styles.sendBtn} onPress={this._send}>
          <Ionicons name={'ios-send-sharp'} color={THEME.WHITE} size={27} />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'flex-end',
  },
  txtInpCon: {
    flex: 1,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: THEME.ACTIVE_COLOR,
    borderRadius: 30,
  },
  txtInp: {
    maxHeight: 70,
  },
  sendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    width: 50,
    height: 50,
    backgroundColor: THEME.ACTIVE_COLOR,
    borderRadius: 25,
  },
});
