import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import THEME from '../../config/theme';
import Modal from 'react-native-modal';

const Loader = (props) => 
  <Modal isVisible={props.isVisible} backdropOpacity={0.5}>
      <ActivityIndicator size={"large"} color={THEME.GRADIENT_BG.END_COLOR}/>
  </Modal>

export default Loader