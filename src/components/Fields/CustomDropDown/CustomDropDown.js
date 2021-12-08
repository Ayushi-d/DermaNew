import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import THEME from '../../../config/theme';
import Drop from '../../../assets/general/ic_drop.png';
import DropModal from './DropModal';

class CustomDropDown extends React.Component {
  state = {
    showModal: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    dropDownPosition: 0,
  };

  componentDidMount() {
    this.initialIndex = this.getInitialIndex();

    this.flatListSize =
      this.props.data.length * 50 < 200 ? this.props.data.length * 50 : 200;

    this.flatListSize += 20;
  }

  parseValue = (value) => {
    if (value === 1) {
      return 'Show my name';
    }

    if (value === 0) return 'Hide my name';

    return value;
  };

  _handleChange = (val) => {
    this.setState({showModal: false});
    let value = val;

    if (this.props.handleChange) {
      this.props.handleChange(value);
      return;
    }

    if (this.props.parseData) {
      value = this.props.parseData[val];
    }

    this.props.pushChange(this.props.name, value);
  };

  showModal = (e) => {
    this.containerRef.measureInWindow((x, y, width, height) => {
      if (y + height + this.flatListSize > Dimensions.get('window').height) {
        this.setRightY(-1);
      } else {
        this.setRightY(0);
      }
    });
  };

  setRightY = (position) => {
    this.containerRef.measureInWindow((x, y, width, height) => {
      this.setState({
        showModal: true,
        x,
        y,
        width,
        height,
        dropDownPosition: position,
      });
    });
  };

  hideModal = () => {
    this.setState({showModal: false});
  };

  getInitialIndex = () => {
    let currentIndex = -1;
    this.props.data.map((item, index) => {
      if (item.value === this.parseValue(this.props.value)) {
        currentIndex = index;
      }
    });

    return currentIndex;
  };

  render() {
    return (
      <View
        style={[
          style.container,
          this.props.style,
          {marginBottom: this.props.error ? 20 : 0},
        ]}
        ref={(ref) => (this.containerRef = ref)}
        onLayout={() => null}>
        <TouchableOpacity
          style={[
            style.input,
            this.props.inputStyle,
            this.props.disabled
              ? {
                  // backgroundColor: 'rgba(240, 240, 240, 1)',
                  backgroundColor: THEME.DISABLED,
                }
              : {},
          ]}
          onPress={this.showModal}
          disabled={this.props.disabled}>
          {this.props.label ? (
            <Text style={style.label}>{this.props.label}</Text>
          ) : null}
          {!this.props.notShowDropImage && <Image style={style.drop} source={Drop} />}
          <Text style={this.props.disabled ? style.value : {}}>
            {this.parseValue(this.props.value) || 'Select'}
          </Text>
        </TouchableOpacity>
        {this.props.error ? (
          <Text style={{color: THEME.ERROR_REG, padding: 5, marginBottom: 10}}>
            {this.props.error}
          </Text>
        ) : null}
        {this.state.showModal ? (
          <DropModal
            show={this.state.showModal}
            dimensions={{...this.state}}
            closeModal={this.hideModal}
            data={this.props.data}
            currentIndex={
              !this.props.currentIndex
                ? this.getInitialIndex()
                : this.props.currentIndex
            }
            handleChange={this._handleChange}
            dropModalStyle={this.props.dropModalStyle}
            dropDownPosition={this.state.dropDownPosition}
          />
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
    justifyContent: 'center',
  },
  container: {
    marginTop: 20,
    height: 50,
  },
  inputContainer: {},
  label: {
    position: 'absolute',
    color: THEME.PARAGRAPH,
    fontSize: 12,
    height: 20,
    textAlign: 'center',
    // lineHeight: 20,
    top: -10,
    left: 10,
    // backgroundColor: THEME.WHITE,
    paddingHorizontal: 5,
  },
  drop: {
    width: 15,
    height: 15,
    opacity: 0.5,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -7.5}],
  },

  value: {
    color: THEME.PARAGRAPH
  },
});

export default CustomDropDown;
