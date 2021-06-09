import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import THEME from '../../../config/theme';

class DropModal extends React.Component {
  getStyle = () => {
    let len = this.props.data.length;
    if (this.props.dropDownPosition == -1) {
      return {
        top: this.props.dimensions.y - (50 * len > 200 ? 200 : 50 * len),
        left: this.props.dimensions.x,
        width: this.props.dimensions.width,
      };
    } else {
      return {
        top: this.props.dimensions.y + this.props.dimensions.height,
        left: this.props.dimensions.x,
        width: this.props.dimensions.width,
      };
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <ReactNativeModal
        visible={this.props.show}
        style={style.modal}
        transparent={true}
        onBackdropPress={this.props.closeModal}>
        <View
          style={[style.container, this.getStyle(), this.props.dropModalStyle]}>
          <FlatList
            style={style.flatList}
            data={this.props.data}
            keyExtractor={(item, index) => {
              return `${item.value} - ${index}`;
            }}
            initialScrollIndex={this.props.currentIndex}
            getItemLayout={(item, index) => {
              return {
                length: 50,
                offset: 50 * index,
                index,
              };
            }}
            renderItem={({item, index}) => {
              return (
                <DropItem
                  value={item.value}
                  handleChange={this.props.handleChange}
                  isSelected={index == this.props.currentIndex}
                />
              );
            }}
          />
        </View>
      </ReactNativeModal>
    );
  }
}

class DropItem extends React.PureComponent {
  render() {
    let {isSelected} = this.props;
    return (
      <TouchableOpacity
        style={style.item}
        activeOpacity={0.9}
        onPress={() => this.props.handleChange(this.props.value)}>
        <Text
          style={[
            style.itemText,
            {
              color: this.props.isSelected
                ? THEME.GRADIENT_BG.END_COLOR
                : THEME.GRAY,
            },
          ]}>
          {this.props.value}
        </Text>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  modal: {
    flex: 1,
    opacity: 1,
    margin: 0,
  },

  item: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: THEME.BORDERCOLOR,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 14,
  },
  flatList: {
    maxHeight: 200,
  },
  container: {
    position: 'absolute',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: THEME.WHITE,
  },
});

export default DropModal;
