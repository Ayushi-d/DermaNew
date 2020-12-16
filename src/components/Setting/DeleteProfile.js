import React from 'react';
import {StyleSheet, View, Text, ScrollView, Settings} from 'react-native';
import THEME from '../../config/theme';
import deleteForm from '../../assets/data/deleteForm';
import {Loader} from '../modals';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import DateHelpers from '../../helpers/datehelpers';
import SettingsHeader from '../Headers/SettingsHeader';

class DeleteProfile extends React.Component {
  state = {
    values: {
      sub: '',
      md: '',
    },
    error: {},
    loading: false,
  };

  _pushChange = (name, value) => {
    let values = {...this.state.values};
    values[name] = value;
    this.setState({values, error: {}});
  };

  _validateData = () => {
    let error = {...this.state.error};
    let values = {...this.state.values};

    Object.keys(values).map((item) => {
      if (values[item] == '' && item != 'md') {
        error[item] = 'Field is required!';
      }
    });

    return error;
  };

  _submitData = () => {
    let error = this._validateData();

    this.setState({error}, () => {
      if (Object.keys(this.state.error).length == 0) {
        this.makeDeleteRequest();
      }
    });
  };

  makeDeleteRequest = async () => {
    this.setState({loading: true});

    let cUID = auth().currentUser.uid;
    let userSnap = await database().ref(`/Users/${cUID}`).once('value');
    let user_data = userSnap.val();

    let deleteData = {
      id: cUID,
      e: user_data['em'],
      sub: this.state.values.sub || 'None',
      md: this.state.values.md || 'No Details',
      tp: DateHelpers.getTodayInDDMMYYYY(),
      nid: user_data['nid'],
    };

    // set deletedUsers data
    await database().ref('deletedUsers').child(cUID).set(deleteData);

    // set the del value of the user to 1
    await database().ref(`Users/${cUID}`).child('del').set(1);

    // signOut
    auth()
      .signOut()
      .then((res) => {
        this.setState({loading: false}, () => {
          alert(
            'Your profile has been submited for deletion.\nIt will be removed from the system soon and you will be informed accordingly.',
          );

          this.props.context._logout();
        });
      })
      .catch((err) => {
        console.log('delete profile err: ', err);
        this.setState({loading: false});
      });
  };

  renderDeleteForm = () => {
    return (
      <View style={style.formContainer}>
        <Text style={style.text}>We'll miss you!</Text>
        <View style={style.fieldContainer}>
          {deleteForm.map((item) => (
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

  render() {
    return (
      <View style={{flex: 1}}>
        <SettingsHeader title={'Delete'} {...this.props} />
        <ScrollView style={{flex: 1}}>
          {this.renderDeleteForm()}
          {this.state.loading ? (
            <Loader isVisible={this.state.loading} />
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  text: {
    color: THEME.GRAY,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  formContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 50,
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

export default DeleteProfile;
