import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import THEME from '../../config/theme';
import {OutlinedTextField} from 'rn-material-ui-textfield';
import LinearGradient from 'react-native-linear-gradient';

class UploadFile extends React.Component {
  fieldRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  _handleChange = text => {
      this.props.pushChange(this.props.name, this.state.text);
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
        />

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
        <TouchableOpacity style={style.attachFile} onPress={this.props.uploadPicture}>
          <LinearGradient
            colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
            start={{x: 0, y: 0}}
            style={{height: 50, alignItems: 'center', justifyContent: 'center'}}
            end={{x: 1, y: 0}}
          >
            <Text style={{color: THEME.WHITE, fontSize: 12, fontWeight:'bold'}}>
              BROWSE
            </Text>
          </LinearGradient>
        </TouchableOpacity>

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
    height: 50,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
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
  attachFile: {
    position: 'absolute',
    height: 50,
    width: '30%',
    right: 0,
    borderRadius: 5
  },
});

export default UploadFile;
