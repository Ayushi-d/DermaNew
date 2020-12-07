import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import deleteIcon from '../../assets/managePhotos/ic_delete.png';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import {getScale} from '../../helpers/scale'

/**
 * @param uri -> uri to photo
 * @param deletePhoto -> deletePhoto
 * @param onHelpTextPress
 * @param helpText
 */
class Photo extends React.Component {
  render() {
    return (
      <View style={cards.card}>
        <Image
          source={{uri: this.props.uri}}
          style={{width: '100%', height: '100%'}}
        />

        <TouchableOpacity style={cards.delete} onPress={this.props.deletePhoto}>
          <Image
            source={deleteIcon}
            style={{width: 20, height: 20, resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        <LinearGradient
          colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
          style={[cards.status]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        >
          <TouchableOpacity
            onPress={this.props.onHelpTextPress}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{color: THEME.WHITE}}>{this.props.helpText}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

const cards = StyleSheet.create({
  card: {
    marginBottom: 20,
    width: Dimensions.get('window').width *0.9,
    height:  Dimensions.get('window').width *0.9,
    maxWidth:getScale(350),
    maxHeight:getScale(350),
  },
  delete: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: THEME.WHITE,
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    height: 40,
    position: 'absolute',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    alignSelf: 'center',
  },
});

export default Photo;
