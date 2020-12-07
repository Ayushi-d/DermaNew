import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import FEMALE_CR from '../../assets/registration/ic_female_color.png';
import MALE_CR from '../../assets/registration/ic_male_color.png';
import FEMALE from '../../assets/registration/ic_female.png';
import MALE from '../../assets/registration/ic_male.png';
import THEME from '../../config/theme';

class Gender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      male: this.props.value == "Male" ? true : false,
      female: this.props.value == "Female" ? true : false,
    };
  }

  _changeGender = name => {
    if (name == 'male') {
      this.setState({male: true, female: false}, () => this._pushChange("Male"));
      return;
    }

    if (name == 'female') {
      this.setState({male: false, female: true}, () => this._pushChange("Female"));
    }
  };

  _pushChange = (value) => {
    this.props.pushChange(this.props.name, value)
  }

  render() {
    return (
      <View style={style.container}>
        <Text style={style.label}>{this.props.label}</Text>
        <View style={style.imageContainer}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
            }}
            onPress={() => this._changeGender('female')}
          >
            <Image
              style={style.image}
              source={this.state.female ? FEMALE_CR : FEMALE}
            />
            <Text
              style={
                ([style.label],
                [
                  {
                    color: this.state.female
                      ? THEME.GRADIENT_BG.START_COLOR
                      : THEME.PARAGRAPH,
                  },
                ])
              }
            >
              Female
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: '100%',
              width: 2,
              backgroundColor: THEME.BORDERCOLOR,
              marginLeft: 10,
              marginRight: 30,
            }}
          ></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => this._changeGender('male')}
          >
            <Image
              style={style.image}
              source={this.state.male ? MALE_CR : MALE}
            />
            <Text
              style={
                ([style.label],
                [
                  {
                    color: this.state.male
                      ? THEME.GRADIENT_BG.START_COLOR
                      : THEME.PARAGRAPH,
                  },
                ])
              }
            >
              Male
            </Text>
          </TouchableOpacity>
        </View>
        {this.props.error ? (
          <Text style={{color: THEME.ERROR_REG, padding: 5, fontSize: 12}}>
            {this.props.error}
          </Text>
        ) : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  label: {
    color: THEME.PARAGRAPH,
    fontSize: 12,
  },
  image: {
    height: 30,
    resizeMode: 'contain',
  },
  imageContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 5,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 4,
    height: 50,
  },
});

export default Gender;
