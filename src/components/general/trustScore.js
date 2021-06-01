import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import addPhoto from '../../assets/dashboard/ic_add_email.png';
import verFacebook from '../../assets/dashboard/ic_ver_facebook.png';
import verMobile from '../../assets/dashboard/ic_ver_mobile.png';
import verPhoto from '../../assets/dashboard/ic_ver_photo.png';
import verEmail from '../../assets/dashboard/ic_email.png';
import THEME from '../../config/theme';

const trustScoreObj = [
  ['dp', addPhoto, 'Add\nPhoto 20%'],
  ['em', verEmail, 'Verify\nEmail 20%'],
  ['f', verFacebook, 'Link\nFacebook 20%'],
  ['m', verMobile, 'Verify\nMobile 20%'],
  ['pd', verPhoto, 'Verify\nPhoto ID 20%'],
];

class TrustScore extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.ts.ts == 100) return null;
    let check = false;

    trustScoreObj.forEach((item) => {
      if (this.props.ts[item[0]] == 0) {
        check = true;
      }
    });

    if (!check) return null;
    return (
      <View
        style={[
          {
            flexDirection: 'row',
          },
          this.props.style,
        ]}>
        {trustScoreObj.map((item, index) =>
          this.props.ts[item[0]] == 0 ? (
            <TouchableOpacity
              style={[ts.link, {borderRightWidth: 0}]}
              key={index}
              onPress={this.props._onPress}>
              <Image source={item[1]} style={ts.image} />
              <Text style={[{textAlign: 'center'}, ts.text]}>{item[2]}</Text>
            </TouchableOpacity>
          ) : null,
        )}
      </View>
    );
  }
}

const ts = StyleSheet.create({
  link: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    alignItems: 'center',
    height: '100%',
    paddingTop: 10,
  },
  text: {
    color: THEME.PARAGRAPH,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default TrustScore;
