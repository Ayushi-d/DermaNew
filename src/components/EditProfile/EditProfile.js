import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {getData} from '../../config/parseuser';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import EP, {topText} from '../../assets/data/ep';
import Country from '../../helpers/country';
import {Loader} from '../modals';
import THEME from '../../config/theme';

import Header from '../Headers/SettingsHeader';

class EditProfileJSX extends React.Component {
  constructor(props) {
    super(props);
    this.data = this.props.route.params.data;

    this.items = EP['profile'][this.data];

    let state = {};

    this.items.map(
        (item) =>
            (state[item.name] = getData(
                this.props.context.user,
                item.label,
                false,
                true,
            )),
    );

    this.state = {values: {...state}, error: {}, s: [], ct: [], loading: false};

    // console.log(this.state, 'check');
  }

  componentDidMount() {
    this.stateData(this.state.values.c);
    this.cityData(this.state.values.s);
  }

  alertAboutMe = () => {
    if (this.data == 'About Me') {
      alert(
          'Profile bio has been updated successfully.\nIt will go live after admin approval.',
      );
    } else {
      return;
    }
  };

  validateValue = () => {
    let values = {...this.state.values};
    let error = {};
    for (let item of this.items) {
      if (item.name == 'ch' || item.name == 'dt' || item.name == 'ae') {
        continue;
      }
      if (values[item.name] === '') {
        error[item.name] = 'This field is required';
      } else if (item.name == 'em') {
        let re = /\S+@\S+\.\S+/;
        if (!re.test(values[item.name])) {
          error[item.name] = 'This is not a valid email address.';
        }
      }
    }
    return error;
  };

  stateData = (data) => {
    Country.getStates(data)
        .then((res) => {
          this.setState({s: res, loading: false});
        })
        .catch((err) => {});
  };

  cityData = (data) => {
    Country.getCities(data)
        .then((res) => {
          this.setState({ct: res, loading: false});
        })
        .catch((err) => {});
  };

  formatData = (data) => {
    if (!Array.isArray(data)) return data;
    data = data ? data.map((item) => ({value: item})) : [];
    return data;
  };

  _pushChange = (name, value) => {
    let values = {...this.state.values};
    values[name] = value;

    if (name == 'c') {
      this.setState({loading: true});
      this.stateData(value);
      values['s'] = '';
      values['ct'] = '';
    }

    if (name == 's') {
      this.setState({loading: true});
      this.cityData(value);
      values['ct'] = '';
    }

    this.setState({values}, () => {
      let error = this.validateValue();
      this.setState({error});
    });
  };

  saveChanges = () => {
    this.setState({loading: true});
    let error = this.validateValue();
    this.setState({error}, () => {
      if (Object.keys(error).length == 0) {
        this.props.context
            .saveToFirebase({...this.state.values})
            .then((res) => {
              this.setState({loading: true}, () => {
                this.alertAboutMe();
                this.goback();
              });
            });
      } else {
        this.setState({loading: false});
      }
    });
  };

  renderItems = () => {
    return this.items.map((item) => {
          console.log('item.name', item)
          return (
              item.name == 'rl' ? (
                  this.props.context.user && this.props.context.user.rle == 1 ? (
                      <item.DISABLED_COMPONENT
                          label={item.label}
                          data={this.formatData(
                              item.fetchFromServer ? this.state[item.name] : item.data,
                          )}
                          key={item.name}
                          name={item.name}
                          error={this.state.error[item.name]}
                          pushChange={this._pushChange}
                          value={this.state.values[item.name]}
                          dropDownPosition={item.dropDownPosition}
                          disabled={true}
                      />
                  ) : (
                      <item.component
                          label={item.label}
                          data={this.formatData(
                              item.fetchFromServer ? this.state[item.name] : item.data,
                          )}
                          key={item.name}
                          name={item.name}
                          error={this.state.error[item.name]}
                          pushChange={this._pushChange}
                          value={this.state.values[item.name]}
                          dropDownPosition={item.dropDownPosition}
                          disabled={item.disabled}
                          parseData={item.parseData}
                      />
                  )
              ) : (
                  <item.component
                      label={item.label}
                      data={this.formatData(
                          item.fetchFromServer ? this.state[item.name] : item.data,
                      )}
                      key={item.name}
                      name={item.name}
                      error={this.state.error[item.name]}
                      pushChange={this._pushChange}
                      value={this.state.values[item.name]}
                      dropDownPosition={item.dropDownPosition}
                      disabled={item.disabled}
                      parseData={item.parseData}
                      notShowDrop={true}
                      notShowDropImage={item.name === 'sc' || item.name === 'ms'}
                  />
              )
          )
        }
    );
  };

  goback = () => {
    this.props.navigation.goBack();
  };

  renderTopText = () => {
    return !topText[this.data] ? null : (
        <View style={style.top}>
          <Text style={[style.topText, {color: THEME.ERROR_REG}]}>
            {topText[this.data]}
          </Text>
        </View>
    );
  };

  render() {
    return (
        <>
          <Header title={'Edit Profile'} {...this.props} />
          <View
              style={{flex: 1, padding: 20}}
              showsVerticalScrollIndicator={false}>
            <ScrollView
                style={style.shadowBox}
                keyboardShouldPersistTaps={'always'}>
              {this.renderItems()}
              <View
                  style={{
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    marginTop: 20,
                  }}>
                <DEFAULT_BUTTON
                    text={'SAVE'}
                    style={{width: '40%'}}
                    _onPress={this.saveChanges}
                />
                <BUTTON_WITH_PARAM
                    text={'CANCEL'}
                    style={{width: '40%'}}
                    _onPress={this.goback}
                />
              </View>
              <Loader isVisible={this.state.loading} />
              {this.renderTopText()}
            </ScrollView>
          </View>
        </>
    );
  }
}
const EditProfile = (props) => <EditProfileJSX {...props} />;

const style = StyleSheet.create({
  shadowBox: {
    flex: 1,
    height: 50,
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
    paddingRight: 10,
    backgroundColor: THEME.WHITE,
  },

  top: {
    marginTop: 20,
  },
  topText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    lineHeight: 30,
  },
});

export default EditProfile;
