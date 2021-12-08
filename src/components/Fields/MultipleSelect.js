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
import {MultiChoicePicker} from '../modals';

class MultiSelect extends React.Component {
  fieldRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      focused: false,
      show: false,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) this.setState({value: props.value});
  }

  _handleChange = text => {
    this.setState({value: text}, () => {
      this.props.pushChange(this.props.name, this.state.value);
    });
  };

  showModal = () => {
    // this.props.navigation.navigate('SearchMultiple', {
    //   data: this.props.data,
    //   title: this.props.label,
    //   onCancelled: () => this.hideModal,
    //   value: this.state.value,
    //   saveChanges: this.pushChange,
    // })
    this.setState({show: true});
  };

  hideModal = () => {
    // this.props.navigation.goBack();
    this.setState({show: false});
  };

  pushChange = data => {
    // get data

    this.setState({value: data, show: false}, () => {
      this.props.pushChange(this.props.name, this.state.value);
    });
  };

  render() {
    return (
      <View style={style.inputContainer}>
        <TouchableOpacity onPress={this.showModal}>
          <TextInput
            style={[
              style.input,
              {
                borderColor: this.state.focused
                  ? THEME.GRADIENT_BG.START_COLOR
                  : THEME.BORDERCOLOR,
                color: THEME.GRAY,
              },
            ]}
            value={this.props.value}
            onChangeText={this._handleChange}
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
            editable={false}
          />
        </TouchableOpacity>

        <Text
          style={[
            style.label,
            {
              color: this.state.focused
                ? THEME.GRADIENT_BG.START_COLOR
                : THEME.PARAGRAPH,
            },
          ]}
        >
          {this.props.label}
        </Text>
        {this.props.error ? (
          <Text style={{color: THEME.ERROR_REG, padding: 5, fontSize: 12}}>
            {this.props.error}
          </Text>
        ) : null}
        <MultiChoicePicker
          isVisible={this.state.show}
          data={this.props.data}
          title={this.props.label}
          onCancelled={this.hideModal}
          value={this.state.value}
          saveChanges={this.pushChange}
        />
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
});

export default MultiSelect;
