import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {getData} from '../../config/parseuser';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import EP from '../../assets/data/ep';
import Country from '../../helpers/country';
import {Loader} from '../modals';
import Header from '../Headers/SettingsHeader';

import {TextIn, MultiSelect} from '../../components/Fields';
import cdata from '../../assets/data/countryData';

class EditPPJSX extends React.Component {
  constructor(props) {
    super(props);
    this.data = this.props.route.params.data;
    // console.log(this.data);

    if (this.data === 'Religion') {
      this.items = [
        {
          name: 'rl',
          label: 'Religion',
          component: MultiSelect,
          getData: 'Religion',
          data: [
            "Doesn't matter",
            'Atheist',
            'Agnostic',
            'Buddhist',
            'Christian',
            'Hindu',
            'Jain',
            'Jewish',
            'Muslim',
            'Parsi',
            'Sikh',
          ],
          DISABLED_COMPONENT: TextIn,
        },
      ];
    } else if (this.data === 'Location') {
      this.items = [
        {
          name: 'ct',
          label: 'Location',
          component: MultiSelect,
          getData: 'Location',
          data: ["Doesn't matter", ...cdata],
          DISABLED_COMPONENT: TextIn,
        },
      ];
    } else {
      this.items = EP['pp'][this.data];
    }

    let state = {};

    // console.log(
    //   getData(this.props.context.user, this.items[0].item.getData, true),
    // );

    this.items.map(
      (item) =>
        (state[item.name] = getData(
          this.props.context.user,
          item.getData,
          true,
        )),
    );

    this.state = {values: {...state}, error: {}, loading: false};
  }

  validateValue = () => {
    let values = {...this.state.values};
    let error = {};
    for (let item of this.items) {
      if (values[item.name] == '') {
        error[item.name] = 'This field is required';
      } else if (item.name == 'em') {
        let re = /\S+@\S+\.\S+/;
        if (!re.test(values[item.name])) {
          error[item.name] = 'This is not a valid email address.';
        }
      } else if (item.name == 'ag') {
        let ag = this.state.values.ag;
        let a1 = ag[0];
        let a2 = ag[1];

        if (a1 == '' || a2 == '') return;
        if (parseInt(a1) > parseInt(a2)) {
          error[item.name] = 'The range is not correct!';
        }
      }
    }
    return error;
  };

  _pushChange = (name, value) => {
    let values = {...this.state.values};
    values[name] = value;

    if (name == 'c') {
      this.setState({loading: true});
      this.stateData(value);
      values['s'] = '';
    }

    if (name == 's') {
      this.setState({loading: true});
      this.cityData(value);
      values['ct'] = '';
    }

    this.setState({values});
  };

  pushChangePP = (name, data) => {
    this.setState({loading: true}, () => {
      if (name == 'Location') {
        this.props.context
          .savePPToFirebase({c: this.state.values.ct})
          .then((res) => {
            this.setState({loading: false}, () => {
              this.goback();
            });
          });
      } else {
        this.props.context
          .savePPToFirebase({rl: this.state.values.rl})
          .then((res) => {
            this.setState({loading: false}, () => {
              this.goback();
            });
          });
      }
    });
  };

  saveChanges = () => {
    if (this.props.route.params.data === 'Religion') {
      this.pushChangePP('Religion');
      return;
    }

    if (this.props.route.params.data === 'Location') {
      this.pushChangePP('Location');
      return;
    }
    let error = this.validateValue();

    this.setState({error}, () => {
      if (Object.keys(this.state.error).length == 0) {
        this.setState({loading: true});
        const obj = {
          a1: this.state.values.ag[0],
          a2: this.state.values.ag[1],
          sc: this.state.values.sc,
          ms: this.state.values.ms,
        };
        this.props.context.savePPToFirebase(obj).then((res) => {
          this.setState({loading: false}, () => {
            this.goback();
          });
        });
      }
    });
  };

  renderItems = () => {
    return this.items.map((item) => (
      <item.component
        label={item.label}
        key={item.name}
        name={item.name}
        error={this.state.error[item.name]}
        pushChange={this._pushChange}
        value={this.state.values[item.name]}
        dropDownPosition={item.dropDownPosition}
        disabled={item.disabled}
        data={item.data}
      />
    ));
  };

  goback = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Header title={'Edit Preference'} {...this.props} />
        <ScrollView style={style.shadowBox}>
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
        </ScrollView>
      </View>
    );
  }
}
const EditPreference = (props) => <EditPPJSX {...props} />;

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

export default EditPreference;
