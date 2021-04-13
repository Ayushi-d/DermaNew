import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Alert,
  Settings,
} from 'react-native';
import help from '../../assets/settings/ic_help_form.png';
import right from '../../assets/settings/next.png';
import {HeaderMain} from '../general/Header';
import THEME from '../../config/theme';
import helpForm from '../../assets/data/helpForm';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import ImagePicker from 'react-native-image-crop-picker';
import Uploader from '../../helpers/storage';
import DateHelpers from '../../helpers/datehelpers';
import database from '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';
import {Loader} from '../modals';
import SettingsHeader from '../Headers/SettingsHeader';

/**
 * help -> Help -> autoId -> upload the image to help folder -> help
 */

class Help extends React.Component {
  state = {
    values: {
      mail: '',
      cmail: '',
      sub: '',
      des: '',
      url: '',
    },
    imgObj: null,
    error: {},
    loading: false,
  };

  // upload the data to firebase
  uploadToFirebase = async () => {
    this.setState({loading: true});
    let image = this.state.imgObj ? {...this.state.imgObj} : null;
    let sendData = {...this.state.values};
    // delete confirmation email field
    delete sendData.cmail;
    sendData['id'] = `help${Math.floor(Math.random() * 10000000)}`;
    sendData['read'] = 0;
    sendData['ts'] = DateHelpers.getTodayInReadableFormat();
    let url = '';

    if (!image) {
      try {
        let val = await database()
          .ref('/Help')
          .child(sendData['id'])
          .set(sendData);
      } catch (err) {
        alert(err);
        return false;
      }

      alert('Thanks for contacting us. We will respond back soon.');

      this.setState({
        values: {
          mail: '',
          cmail: '',
          sub: '',
          des: '',
          url: '',
        },
        imgObj: null,
        error: {},
        loading: false,
      });
      return;
    }
    try {
      url = await Uploader.uploadFileHelp(image.path);
    } catch (err) {
      alert(err);
      this.setState({loading: false});
      return;
    }
    if (url.error) {
      this.setState({loading: false});
      alert(url.error);
      return;
    }

    sendData['url'] = url['url'];

    try {
      let val = await database()
        .ref('/Help')
        .child(sendData['id'])
        .set(sendData);
    } catch (err) {
      alert(err);
      return false;
    }
    alert('Thanks for contacting us. We will respond back soon.');

    this.setState({
      values: {
        mail: '',
        cmail: '',
        sub: '',
        des: '',
        url: '',
      },
      imgObj: null,
      error: {},
      loading: false,
    });
  };

  navigateToFAQs = () => {
    this.props.navigation.navigate('Frequently Asked Question', {
      hideHeader: true,
    });
  };

  renderHelpForm = () => {
    return (
      <View style={style.formContainer}>
        <Image source={help} style={style.helpImage} />
        <View style={style.fieldContainer}>
          {helpForm.map((item) => (
            <item.component
              label={item.label}
              key={item.name}
              name={item.name}
              error={this.state.error[item.name]}
              pushChange={(name, text) => this._pushChange(name, text)}
              value={this.state.values[item.name]}
              dropDownPosition={item.dropDownPosition}
              disabled={item.disabled}
              data={item.data ? item.data.map((it) => ({value: it})) : null}
              uploadPicture={() => this.uploadPicture()}
            />
          ))}

          <View
            style={{
              justifyContent: 'space-around',
              flexDirection: 'row',
              margin: 20,
              paddingTop: 10,
            }}>
            <BUTTON_WITH_PARAM
              text={'CANCEL'}
              style={{width: '40%'}}
              _onPress={() => this.props.navigation.goBack()}
            />
            <DEFAULT_BUTTON
              text={'SUBMIT'}
              style={{width: '40%'}}
              _onPress={() => this._submitData()}
            />
          </View>
        </View>
      </View>
    );
  };

  // renderHeader = () => {
  //   let data = this.props.navigation.getParam('hideHeader');
  //   if (data) return null;
  //   return <HeaderMain routeName={'Help'} {...this.props} />;
  // };

  render() {
    return (
      <View style={{flex: 1}}>
        {/* {this.renderHeader()} */}
        <SettingsHeader title={'Help'} {...this.props} />
        <ScrollView>
          <TouchableOpacity style={style.faqs} onPress={this.navigateToFAQs}>
            <Text style={style.text}>FAQS</Text>
            <Image source={right} style={style.right} />
          </TouchableOpacity>

          <Text
            style={{
              color: THEME.GRAY,
              fontSize: 16,
              textAlign: 'center',
              padding: 10,
            }}>
            Choose any of the below ways to contact us.
          </Text>

          {/* Mail client open*/}
          <TouchableOpacity
            style={style.emailContainer}
            // onPress={this.helpToGmail}
          >
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={style.email}>support@dermacupid.com</Text>
              <Text style={{color: THEME.GRAY, fontSize: 12}}>
                (We will respond within 1 working day.)
              </Text>
            </View>
          </TouchableOpacity>

          {/** render help form*/}
          {this.renderHelpForm()}
          {this.state.loading ? (
            <Loader isVisible={this.state.loading} />
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

Help.prototype.showSuccesMessage = () => {
  Snackbar.show({
    text: 'You form has been submitted. We will respond withing 24 hours.',
    duration: Snackbar.LENGTH_INDEFINITE,
    action: {
      title: 'Ok',
      color: THEME.GRADIENT_BG.END_COLOR,
    },
  });
};

// upload the data to firebase
// Help.prototype.uploadToFirebase = async function() {
//   this.setState({loading: true});
//   let image = this.state.imgObj ? {...this.state.imgObj} : null;
//   let sendData = {...this.state.values};
//   // delete confirmation email field
//   delete sendData.cmail;
//   sendData['id'] = `help${Math.floor(Math.random() * 10000000)}`;
//   sendData['read'] = 0;
//   sendData['ts'] = DateHelpers.getTodayInReadableFormat();
//   let url = '';

//   if (!image) {
//     try {
//       let val = await database()
//         .ref('/Help')
//         .child(sendData['id'])
//         .set(sendData);
//     } catch (err) {
//       alert(err);
//       return false;
//     }
//     this.setState({
//       values: {
//         mail: '',
//         cmail: '',
//         sub: '',
//         des: '',
//         url: '',
//       },
//       imgObj: null,
//       error: {},
//       loading: false,
//     });
//     return;
//   }
//   try {
//     url = await Uploader.uploadFileHelp(image.path);
//   } catch (err) {
//     alert(err);
//     this.setState({loading: false});
//     return;
//   }
//   if (url.error) {
//     this.setState({loading: false});
//     alert(url.error);
//     return;
//   }

//   sendData['url'] = url['url'];

//   try {
//     let val = await database()
//       .ref('/Help')
//       .child(sendData['id'])
//       .set(sendData);
//   } catch (err) {
//     alert(err);
//     return false;
//   }

//   alert("Thanks for contacting us.'\n' We will respond back soon.");

//   this.setState({
//     values: {
//       mail: '',
//       cmail: '',
//       sub: '',
//       des: '',
//       url: '',
//     },
//     imgObj: null,
//     error: {},
//     loading: false,
//   });
// };

// push changes
Help.prototype._pushChange = function (name, value) {
  let values = {...this.state.values};
  values[name] = value;
  this.setState({values, error: {}});
};

// pick the file
Help.prototype.uploadPicture = function () {
  ImagePicker.openPicker({
    width: 400,
    height: 400,
  })
    .then((image) => {
      let fileName = image.path.split('/').pop();
      let values = {...this.state.values};
      values['url'] = fileName;
      this.setState({imgObj: image, values});
    })
    .catch((err) => alert(err));
};

// submit the data
Help.prototype._submitData = function () {
  let error = this._validateData();

  this.setState({error}, () => {
    if (Object.keys(this.state.error).length == 0) {
      this.uploadToFirebase();
    }
  });
};

// validate data entered
Help.prototype._validateData = function () {
  let error = {...this.state.error};
  let values = {...this.state.values};

  if (values.mail.toLowerCase() != values.cmail.toLowerCase()) {
    error['cmail'] = 'Email address does not match.';
  }
  Object.keys(values).map((item) => {
    if (item == 'mail' || item == 'cmail') {
      let re = /\S+@\S+\.\S+/;
      if (!re.test(values[item])) {
        error[item] = 'This is not a valid email address.';
      }
    }
    if (values[item] == '' && item != 'url') {
      error[item] = 'Field is required!';
    }
  });

  return error;
};

// open gmail
Help.prototype.helpToGmail = () => {
  Linking.openURL('mailto:support@dermacupid.com');
};

const style = StyleSheet.create({
  faqs: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: THEME.BORDERCOLOR,
  },
  right: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  text: {
    color: THEME.BLUE,
    fontWeight: 'bold',
    marginRight: 10,
  },
  email: {
    color: THEME.BLUE,
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    flex: 1,
    width: '90%',
    textAlign: 'center',
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  emailContainer: {
    paddingBottom: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 2,
    backgroundColor: THEME.WHITE,
  },

  formContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 2,
    padding: 20,
    backgroundColor: THEME.WHITE,
    alignItems: 'center',
  },

  helpImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  fieldContainer: {
    width: '100%',
  },
});

export default Help;
