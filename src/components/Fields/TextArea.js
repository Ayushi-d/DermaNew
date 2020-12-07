import React from 'react';
import {View, Text, StyleSheet, TextInput, Image} from 'react-native';
import THEME from '../../config/theme';

class TextArea extends React.Component {
  fieldRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  _handleChange = text => {
    this.props.pushChange(this.props.name, text);
  };

  render() {
    return (
      <View style={style.inputContainer}>
        <TextInput
          style={[
            style.input,
            {
              borderColor: this.state.focused
                ? THEME.GRADIENT_BG.START_COLOR
                : THEME.BORDERCOLOR,
              backgroundColor: this.props.disabled
                ? THEME.DISABLED
                : THEME.WHITE,
            },
          ]}
          value={this.props.value}
          onChangeText={this._handleChange}
          onFocus={() => this.setState({focused: true})}
          onBlur={() => this.setState({focused: false})}
          editable={this.props.disabled ? false : true}
          multiline={true}
          numberOfLines={5}
          placeholder={this.props.placeholder}
        />

        {this.props.label ? (
          <Text
            style={[
              style.label,
              {
                color: this.state.focused
                  ? THEME.GRADIENT_BG.START_COLOR
                  : THEME.PARAGRAPH,
                backgroundColor: this.props.disabled
                  ? 'transparent'
                  : THEME.WHITE,
              },
            ]}
          >
            {this.props.label}
          </Text>
        ) : null}
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
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    position: 'absolute',
    color: THEME.PARAGRAPH,
    fontSize: 12,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    top: -10,
    left: 10,
    backgroundColor: THEME.WHITE,
    paddingHorizontal: 5,
  },
});

export default TextArea;
