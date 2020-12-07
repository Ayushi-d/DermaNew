import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import camera from '../../assets/general/ic_camera.png';
import gallery from '../../assets/general/ic_gallery.png';

const ImagePickerWithCrop = props => (
  <Modal
    isVisible={props.isVisible}
    backdropOpacity={0.5}
    onBackdropPress={props.onTapOutSide}
  >
    <LinearGradient
      colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
      style={[picker.header, props.style]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    >
      <Text style={picker.heading}>UPLOAD PHOTO</Text>
    </LinearGradient>
    <View style={picker.uploadActionContainer}>
      <TouchableOpacity style={picker.uploadAction} onPress={props.fromGallery}>
        <Image source={gallery} style={picker.image} />
        <Text>From Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={picker.uploadAction} onPress={props.fromCamera}>
        <Image source={camera} style={picker.image} />
        <Text>Take a selfie</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const picker = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'center',
    padding: 10,
  },
  heading: {
    color: THEME.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadActionContainer: {
    backgroundColor: THEME.WHITE,
    padding: 20,
  },
  uploadAction: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderColor: THEME.BORDERCOLOR,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
});

export default ImagePickerWithCrop;
