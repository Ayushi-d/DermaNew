import React from 'react';
import Modal from 'react-native-modal';
import {
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../config/theme';
import {getScale} from '../helpers/scale';
const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

const UpdateModal = ({visible, url}) => {
  console.log(url);
  const updateApp = () => {
    if (Platform.OS === 'android') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log('not supported');
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  };
  return (
    <Modal isVisible={visible} style={{height: getScale(200)}}>
      <LinearGradient
        colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: getScale(200),
        }}>
        <Text style={{color: THEME.WHITE, fontSize: 12}}>
          New features added/bugs resolved. Update is required.
        </Text>
        <TouchableOpacity style={style.DEFAULT_BUTTON} onPress={updateApp}>
          <Text style={{color: THEME.WHITE}}>Update</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};
const style = StyleSheet.create({
  DEFAULT_BUTTON: {
    width: '40%',
    alignItems: 'center',
    height: getScale(45),
    justifyContent: 'center',
    borderRadius: 27.5,
    backgroundColor: THEME.LOGINBUTTON,
    marginTop: getScale(20),
  },
});

export default UpdateModal;
