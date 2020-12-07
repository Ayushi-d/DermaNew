import React from 'react';
import {View, Text, Image, StyleSheet, ScrollView, Alert} from 'react-native';
import ts from '../../assets/trustscore/ic_trust.png';
import THEME from '../../config/theme';

import DEFAULT_BUTTON from '../general/button';
import UpdateTS from '../../helpers/updatets';
import {func} from 'prop-types';
import ImagePickerWithCrop from '../modals/ImagePicker';
import {Loader} from '../modals';
import Uploader from '../../helpers/storage';
import ImagePicker from 'react-native-image-crop-picker';
import LinkAccount from '../../helpers/linkAccount';
import CustomBackAction from '../general/CustomBackAction';

import Header from '../Headers/SettingsHeader';

const data = {
  dp: {
    0: 'Add your recent photo (20%)',
    1: ' Photo Added',
    '-1': 'Profile Photo is under verification',
    helptext: null,
    buttonText: 'ADD PHOTO',
    action: function () {
      this.props.navigation.navigate('Manage Photos');
    },
  },
  em: {
    0: 'Verify your email (20%)',
    1: 'Email Id Verified',
    '-1': '',
    helptext: 'We will never share your email with other users',
    buttonText: 'VERIFY EMAIL',
    action: function () {
      this.props.navigation.navigate('Email Address');
    },
  },
  f: {
    0: 'Connect your facebook profile(20%)',
    1: 'Facebook Linked',
    '-1': '',
    helptext: 'We will never post anything to your facebook profile.',
    buttonText: 'CONNECT NOW',
    action: function () {
      this.setState({loading: true});
      LinkAccount.withFB().then((res) => {
        if (res) {
          this.props.context.verifyFB().then((res) => {
            if (res) {
              this.props.context.updateTSBy20().then((res) => {
                this.setState({loading: false});
              });
            } else {
              this.setState({loading: false});
            }
          });
        } else {
          this.setState({loading: false});
        }
      });
    },
  },
  m: {
    0: 'Verify your Mobile Number (20%)',
    1: 'Mobile Verified',
    '-1': '',
    helptext: 'We will never share your mobile number with other users',
    buttonText: 'VERIFY MOBILE',
    action: function () {
      this.props.navigation.navigate('Phone Number');
    },
  },
  pd: {
    0: 'Verify your photo Id (20%)',
    1: 'Photo Id Verified',
    '-1': 'Photo Id is under verification',
    helptext:
      'Upload a copy of your driving license, passport or any other photo ID.That has your photo, date of birth and name mentioned on it.\n\nWe will never share your photo id with other users.',
    buttonText: 'UPLOAD',
    action: function () {
      this._onFromGallery(true);
    },
  },
};

class TrustScoreJSX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModal: false,
      loading: false,
      progress: 0,
    };
  }

  _onPressUpload = () => {
    this.setState({uploadModal: !this.state.uploadModal});
  };

  setProgress = (value) => {
    this.setState({progress: value});
  };

  onCompletion = (result) => {
    this.setState({loading: false, progress: 0});
  };

  _uploadPhotoId = (result) => {
    this.setState({loading: false, progress: 0}, () => {
      alert(
        'Your Photo ID has been uploaded successfully.\nThe trust score will be updated after verification.',
      );
    });
  };

  _onFromGallery = (fromPhotoId = false) => {
    // ImagePciker
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: fromPhotoId ? false : true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        this.setState({uploadModal: false, loading: true});
        Uploader.uploadFile(
          image.path,
          this.setProgress,
          fromPhotoId ? this._uploadPhotoId : this.onCompletion,
          true,
        );
      })
      .catch((err) => this.setState({uploadModal: false}));
  };

  _onFromCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        this.setState({uploadModal: false, loading: true});
        Uploader.uploadFile(
          image.path,
          this.setProgress,
          this.onCompletion,
          true,
        );
      })
      .catch((err) => this.setState({uploadModal: false}));
  };

  withStatus = (entity, status) => {
    return (
      <View style={tsStyle.box} key={entity}>
        <Image source={ts} style={tsStyle.ico} />
        <View style={tsStyle.vl} />
        <View style={tsStyle.shadowBox}>
          <Text>{data[entity][status]}</Text>
        </View>
      </View>
    );
  };

  withoutStatus = (entity, status) => {
    return (
      <View style={tsStyle.boxContainer} key={entity}>
        <Text style={tsStyle.heading}>{data[entity][status]}</Text>
        {data[entity].helptext ? (
          <Text style={tsStyle.helptext}>{data[entity].helptext}</Text>
        ) : null}
        <DEFAULT_BUTTON
          text={data[entity].buttonText}
          _onPress={() => data[entity]['action'].call(this)}
        />
      </View>
    );
  };

  renderStatus = (entity, status) => {
    if (status == 0) return this.withoutStatus(entity, status);
    return this.withStatus(entity, status);
  };

  renderTrustStatus = () => {
    const trustScore =
      this.props.context && this.props.context.user
        ? this.props.context.user.ts
        : null;
    let ts = ['dp', 'm', 'f', 'em', 'pd'];
    return (
      <View style={{width: '100%'}}>
        {ts.map((en, i) =>
          en == 'ts' ? null : this.renderStatus(en, trustScore[en]),
        )}
      </View>
    );
  };

  render() {
    return (
      <>
        <Header title={'Trust Score'} {...this.props} />
        <ScrollView
          style={tsStyle.container}
          showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', padding: 20}}>
            <View style={tsStyle.info}>
              <Image source={ts} style={tsStyle.tsImage} />
              <Text style={tsStyle.head}>YOUR PROFILE TRUST SCORE</Text>
              <Text
                style={
                  tsStyle.perc
                }>{`${this.props.context.user.ts.ts}%`}</Text>
            </View>
            {this.renderTrustStatus()}
          </View>
          <ImagePickerWithCrop
            isVisible={this.state.uploadModal}
            fromGallery={this._onFromGallery}
            fromCamera={this._onFromCamera}
            onTapOutSide={this._onPressUpload}
          />
          <Loader isVisible={this.state.loading} />
        </ScrollView>
      </>
    );
  }
}

const tsStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  tsImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  head: {
    fontSize: 20,
    marginTop: 10,
  },
  perc: {
    fontSize: 30,
    color: THEME.GRADIENT_BG.END_COLOR,
    marginTop: 10,
  },
  info: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.BORDERCOLOR,
  },

  vl: {
    width: 1,
    backgroundColor: THEME.BORDERCOLOR,
    position: 'absolute',
    height: 50,
    left: 15,
    zIndex: -1,
  },
  ico: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    top: 15,
    left: 5,
  },
  box: {
    width: '100%',
    paddingLeft: 30,
    marginTop: 20,
  },
  shadowBox: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    backgroundColor: THEME.WHITE,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  boxContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: THEME.WHITE,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  heading: {
    fontSize: 16,
    color: THEME.PARAGRAPH,
    fontWeight: '900',
    marginBottom: 10,
  },
  helptext: {
    color: THEME.GRAY,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
});

const TrustScore = (props) => <TrustScoreJSX {...props} />;

export default CustomBackAction(TrustScore);
