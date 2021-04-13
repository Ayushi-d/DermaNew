import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import React from 'react';
import check from '../../assets/managePhotos/ic_check.png';
import DEFAULT_BUTTON from '../general/button';
import THEME from '../../config/theme';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePickerWithCrop from '../modals/ImagePicker';
import Uploader from '../../helpers/storage';

import deleteIcon from '../../assets/managePhotos/ic_delete.png';
import LinearGradient from 'react-native-linear-gradient';
import {Loader} from '../modals';
import CustomBackAction from '../general/CustomBackAction';
import Photo from './Photo';
import Header from '../Headers/SettingsHeader';

const data = [
  'You can add upto 6 photos.',
  'Prefer solo / selfie pics with nobody else in photo.',
  'Photos will go live after screening by our team.',
];

const dos = `
- Please upload your recent pictures.
- Your face should be clearly visible in the picture.
- Upload Solo/Selfie pictures with no one else in the picture.
- You should be properly dressed in the photos.
`;

const donts = `
- Avoid group photos.
- No photos in bikinis/swimwear.
- No pictures in underwear.
- No Shirtless/underwear Mirror Selfies.
`;

/**
 * 1. aop - unapproved ones
 * 2. op - approved ones
 * 3. dp - approved profile pic
 *
 *  // check op for pic -- index 0 of op will always be profile pic
 *  // if not in op then 0 in aop
 */

const requestCameraPermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Derma Cupid Camera Permission',
          message:
            'Derma Cupid needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        resolve({perm: true});
      } else {
        console.log('Camera permission denied');
        resolve({perm: false});
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

class ManagePhotosJSX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModal: false,
      loading: false,
      progress: 0,
      showGuide: false,
    };
  }

  getKeyFromObject = (url, obj) => {
    let key = null;
    Object.keys(obj).map((item) => {
      if (obj[item] == url) {
        key = item;
      }
    });

    return key;
  };

  makeProfilePhoto = (url) => {
    this.setState({loading: true});

    Uploader.makeProfilePhoto(url)
      .then((res) => {
        this.setState({loading: false});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  _onPressUpload = () => {
    // check for maximum of 6 uploads

    let aop =
      this.props.context &&
      this.props.context.user &&
      this.props.context.user.aop &&
      Object.keys(this.props.context.user.aop);

    let op =
      this.props.context &&
      this.props.context.user &&
      this.props.context.user.op &&
      Object.keys(this.props.context.user.op);

    // console.log([...aop, ...op].length, 'length');

    let length = aop ? aop.length : 0;

    length += op ? op.length : 0;

    if (length >= 6) {
      alert(
        'Maximum 6 photos are allowed.\nTo upload more photos, please delete any of the existing photos.',
      );

      return;
    }

    this.setState({uploadModal: !this.state.uploadModal});
  };

  setProgress = (value) => {
    this.setState({progress: value});
  };

  onCompletion = (result) => {
    this.setState({loading: false, progress: 0});
    alert(
      'Your Photo has been uploaded successfully.\nIt will go live after screening.',
    );
  };

  _onFromGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        this.setState({uploadModal: false, loading: true});
        Uploader.uploadFile(image.path, this.setProgress, this.onCompletion);
      })
      .catch((err) => console.log(err) || this.setState({uploadModal: false}));
  };

  _onFromCamera = () => {
    requestCameraPermission()
      .then((res) => {
        if (res.perm) {
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
              );
            })
            .catch(
              (err) => console.log(err) || this.setState({uploadModal: false}),
            );
        } else {
          alert('Grant Camera access from settings.');
        }
      })
      .catch((err) => {
        alert('Something went wrong. Please try again.');
      });
  };

  renderHeader = () => {
    return (
      <View style={photos.rulesContainer}>
        {data.map((item, i) => (
          <View style={photos.rule} key={i}>
            <Image source={check} style={photos.check} />
            <Text style={photos.ruleText}>{item}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={{padding: 7, marginBottom: 10}}
          onPress={() => {
            this.setState({showGuide: true});
          }}>
          <Text
            style={{
              color: THEME.GRADIENT_BG.END_COLOR,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            PHOTO GUIDELINES
          </Text>
        </TouchableOpacity>
        <DEFAULT_BUTTON
          text={'UPLOAD PHOTO'}
          style={{
            marginTop: 20,
          }}
          _onPress={this._onPressUpload}
        />

        <Modal
          visible={this.state.showGuide}
          onDismiss={() => this.setState({showGuide: false})}
          transparent
          animationType={'fade'}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.setState({showGuide: false})}>
            <Pressable
              style={{
                backgroundColor: '#fff',
                width: '90%',
                padding: 15,
                borderRadius: 4,
              }}
              onPress={() => false}>
              <Text style={{lineHeight: 30, fontSize: 14.3}}>
                <Text
                  style={{
                    fontSize: 21,
                    lineHeight: 45,
                    fontWeight: 'bold',
                    color: THEME.GRADIENT_BG.END_COLOR,
                  }}>
                  Do's
                </Text>
                {dos}

                <Text
                  style={{
                    fontSize: 21,
                    lineHeight: 45,
                    fontWeight: 'bold',
                    color: THEME.GRADIENT_BG.END_COLOR,
                  }}>
                  Dont's
                </Text>
                {donts}
              </Text>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: THEME.GRADIENT_BG.END_COLOR,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    padding: 10,
                    width: 100,
                  }}
                  onPress={() => this.setState({showGuide: false})}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>OK</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  };

  deletePhoto = (key, url, type) => {
    console.log(key, url, 'check delete');
    Alert.alert(
      'Delete photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.setState({loading: true});
            Uploader.deletePhoto(key, url, type)
              .then((res) => {
                console.log(res);
                if (res) {
                  this.setState({loading: false});
                } else {
                  alert('Error in deleting photo.');
                  this.setState({loading: false});
                }
              })
              .catch((err) => {
                console.log('Err: ', err);
                this.setState({loading: false});
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  renderPhotos = () => {
    if (!this.props.context.user) return null;

    const approvedObj =
      this.props.context.user.op && this.props.context.user.op;
    const unapproved =
      this.props.context.user.aop && this.props.context.user.aop;

    const dp = this.props.context.user.dp;
    const ndp = this.props.context.user.ndp;

    if (!approvedObj && !unapproved) return null;

    // console.log(approvedObj, unapproved);

    let key = approvedObj && this.getKeyFromObject(dp, approvedObj);

    return (
      <View style={cards.container}>
        {key ? (
          <Photo
            uri={dp}
            helpText={'Profile Photo'}
            onHelpTextPress={() => null}
            deletePhoto={() => this.deletePhoto(key, dp, 1)}
          />
        ) : null}

        {!approvedObj
          ? null
          : Object.keys(approvedObj)
              .sort()
              // .reverse()
              .map((item, i) =>
                approvedObj[item] != dp ? (
                  <Photo
                    uri={approvedObj[item]}
                    helpText={'Make Profile Photo'}
                    onHelpTextPress={() =>
                      this.makeProfilePhoto(approvedObj[item])
                    }
                    deletePhoto={() =>
                      this.deletePhoto(item, approvedObj[item])
                    }
                    key={i}
                  />
                ) : null,
              )}

        {!unapproved
          ? null
          : Object.keys(unapproved)
              .sort()
              // .reverse()
              .map((item, i) => (
                <Photo
                  uri={unapproved[item]}
                  helpText={'Pending Approval'}
                  onHelpTextPress={() => null}
                  deletePhoto={() => this.deletePhoto(item, unapproved[item])}
                  key={i}
                />
              ))}
      </View>
    );
  };
  render() {
    return (
      <>
        <Header title={'Manage Photos'} {...this.props} />
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 60}}>
          {this.renderHeader()}
          {this.renderPhotos()}
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

const photos = StyleSheet.create({
  rulesContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
    width: '90%',
  },

  check: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  ruleText: {
    letterSpacing: 1,
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 15,
  },
});

const cards = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
});

const ManagePhotos = (props) => <ManagePhotosJSX {...props} />;

export default CustomBackAction(ManagePhotos);
