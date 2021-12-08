import React from 'react';
import {View, StyleSheet} from 'react-native';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import {Loader} from '../modals';
import searchData from '../../assets/data/search';
// import {HeaderMain} from '../general/Header';
import THEME from '../../config/theme';
// import {MainContext} from '../../context/app';
import Header from '../Headers/SettingsHeader';

class SearchJSX extends React.Component {
  constructor(props) {
    super(props);

    this.items = searchData;

    this.state = {
      values: {
        ag: [18, 70],
        sc: "Doesn't matter",
        ms: "Doesn't matter",
        rl: "Doesn't matter",
        c: "Doesn't matter",
      },
      error: {},
      loading: false,
    };
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
    console.log('name * values', name, value)
    console.log('this.state.values', this.state.values)
    let values = {...this.state.values};
    values[name] = value;
    this.setState({values});
  };

  saveChanges = () => {
    let error = this.validateValue();
    this.setState({error}, () => {
      if (Object.keys(this.state.error).length == 0) {
        // get user data from context
        // and change the partner prefrence

        let user = this.props.context ? this.props.context.user : {};
        let search_pp = {...this.state.values};
        search_pp['a1'] = search_pp['ag'][0];
        search_pp['a2'] = search_pp['ag'][1];

        user = user && {...user, pp: search_pp};

        this.props.navigation.navigate('Search Result', {user});
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
        navigation={this.props.navigation}
      />
    ));
  };

  goback = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header title={'Search'} type {...this.props} />
        <View style={style.shadowBox} showsVerticalScrollIndicator={false}>
          {this.renderItems()}
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <DEFAULT_BUTTON
              text={'SEARCH NOW'}
              style={{width: '50%'}}
              _onPress={this.saveChanges}
            />
          </View>
          <Loader isVisible={this.state.loading} />
        </View>
      </View>
    );
  }
}

const Search = (props) => <SearchJSX {...props} />;

const style = StyleSheet.create({
  shadowBox: {
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: THEME.WHITE,
  },
});

export default Search;
