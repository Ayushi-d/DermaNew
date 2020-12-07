import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import check from '../../assets/general/ic_checkbox.png';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import {OptimizedFlatList} from 'react-native-optimized-flatlist';

class MultiChoicePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: (this.props.value && this.props.value.split(',')) || [],
    };

    const simpleSort = this.state.data.sort((a, b) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      return 0;
    });

    this.initialIndex = this.props.data.indexOf(simpleSort[0]);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) this.setState({data: props.value.split(',')});
  }

  handlePress = item => {
    let included = this.state.data.includes(item);

    let data = [...this.state.data];

    if (!included && item == "Doesn't matter") {
      data = [];
      data.push("Doesn't matter");
      this.setState({data: data});
      return;
    }

    if (this.state.data.includes("Doesn't matter")) {
      data.splice(data.indexOf("Doesn't matter"), 1);
    }

    if (!included && this.props.data.length - 1 == data.length + 1) {
      data = [];
      data.push("Doesn't matter");
      this.setState({data: data});
      return;
    }

    if (!included) {
      data.push(item);
      this.setState({data: data});
      return;
    }

    data.splice(data.indexOf(item), 1);

    this.setState({data: data});
  };

  handleClearAll = () => {
    this.setState({data: ["Doesn't matter"]});
  };

  saveChanges = () => {
    if (this.state.data.length == 0) {
      alert('No Option Selected');
      return;
    }

    let pushData = this.state.data.join(',');

    this.props.saveChanges(pushData);
  };

  // onLayout = () => {
  //   this.flatListRef.scrollToIndex({animated: true, index: this.initialIndex});
  // };

  getItemLayout = (item, index) => {
    return {
      length: 50,
      offset: 50 * index,
      index,
    };
  };

  render() {
    const {props} = this;
    return (
      <Modal
        isVisible={props.isVisible}
        backdropOpacity={0.5}
        onBackButtonPress={this.props.onCancelled}
        onBackdropPress={this.props.onCancelled}
      >
        <View style={style.container}>
          <FlatList
            style={style.religions}
            ref={ref => (this.flatListRef = ref)}
            data={props.data}
            keyExtractor={(item, index) => item}
            showsVerticalScrollIndicator={false}
            getItemLayout={this.getItemLayout}
            initialScrollIndex={this.initialIndex}
            renderItem={({item}) => (
              <COUNTRY_ROW
                item={item}
                handlePress={this.handlePress}
                isChecked={this.state.data.includes(item)}
              />
            )}
            ListHeaderComponent={
              <COUNTNRY_HEADER
                title={this.props.title}
                handleClearAll={this.handleClearAll}
              />
            }
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              position: 'absolute',
              bottom: 0,
              backgroundColor: THEME.WHITE,
              width: '90%',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -5,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
              height: 60,
              alignItems: 'center',
            }}
          >
            <BUTTON_WITH_PARAM
              text={'Cancel'}
              style={{width: '40%'}}
              _onPress={() => this.props.onCancelled()}
            />
            <DEFAULT_BUTTON
              text={'Save'}
              style={{width: '40%'}}
              _onPress={this.saveChanges}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

class COUNTRY_ROW extends React.Component {
  shouldComponentUpdate(props) {
    if (props.isChecked == this.props.isChecked) {
      return false;
    }

    return true;
  }

  render() {
    let {item, handlePress, isChecked} = this.props;
    return (
      <View style={style.item}>
        <TouchableOpacity
          style={[
            style.checkbox,
            {
              borderColor: !isChecked
                ? THEME.GRADIENT_BG.START_COLOR
                : THEME.WHITE,
            },
          ]}
          onPress={() => handlePress(item)}
        >
          <Image
            source={check}
            style={[
              style.checkboxImage,
              {display: isChecked ? 'flex' : 'none'},
            ]}
          />
        </TouchableOpacity>
        <Text style={style.text} onPress={() => handlePress(item)}>
          {item}
        </Text>
      </View>
    );
  }
}

const COUNTNRY_HEADER = ({title, handleClearAll}) => {
  return (
    <LinearGradient
      colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
      style={[style.header]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    >
      <Text style={style.heading}>{title} </Text>
      <Text style={style.clear} onPress={handleClearAll}>
        Clear All
      </Text>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  religions: {
    width: '90%',
    backgroundColor: THEME.WHITE,
    marginBottom: 60,
  },
  header: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  heading: {
    color: THEME.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  clear: {
    color: THEME.WHITE,
    marginLeft: 'auto',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 40,
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: THEME.GRADIENT_BG.START_COLOR,
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  checkboxImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    display: 'none',
  },
  text: {
    marginLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: THEME.BORDERCOLOR,
    width: '100%',
    lineHeight: 40,
    fontSize: 12,
  },
  itemContainer: {
    padding: 20,
    marginBottom: 60,
  },
});

export default MultiChoicePicker;
