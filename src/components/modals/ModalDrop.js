import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import THEME from '../../config/theme';

const ModalDrop = props => (
  <ReactNativeModal
    isVisible={props.isVisible}
    style={{margin: 0}}
    backdropOpacity={0}
    onBackdropPress={props.hideModal}
    animationIn={'fadeIn'}
    animationOut={'fadeOut'}
  >
    <View style={[style.modal, {top: props.y}]}>
      <TouchableOpacity onPress={props.reportShow}>
        <Text style={style.text}>Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.blockShow}>
        <Text style={style.text}>Block</Text>
      </TouchableOpacity>
    </View>
  </ReactNativeModal>
);

const style = StyleSheet.create({
  modal: {
    position: 'absolute',
    backgroundColor: THEME.WHITE,
    width: 300,
    top: 20,
    right: 10,
    elevation: 50,
    borderRadius: 2,
  },
  text: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.BORDERCOLOR,
    height: 50,
    lineHeight: 50,
    paddingHorizontal: 10,
  },
});
export default ModalDrop;
