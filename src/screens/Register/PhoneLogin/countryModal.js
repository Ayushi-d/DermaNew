import React from 'react';
import {View, Text, Modal, StyleSheet, FlatList, Pressable} from 'react-native';
import countryCodes from '../../../assets/countryCodes.json';

export default class CountryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  openModal = () => {
    this.setState({showModal: true});
  };

  closeModal = () => {
    this.setState({showModal: false});
  };

  _keyExtractor = (item, index) => {
    return item && item.name ? item.name.toString() : index.toString();
  };

  _onPress = (item) => {
    this.props.onPress(item);
    this.closeModal();
  };

  _renderItem = ({item, index}) => (
    <Pressable style={styles.listItem} onPress={() => this._onPress(item)}>
      <Text style={styles.itemTxt}>
        {item.flag} {item.dial_code} {item.name}
      </Text>
    </Pressable>
  );

  render() {
    let {showModal} = this.state;
    return (
      <Modal visible={showModal} transparent style={styles.modal}>
        <View style={{flex: 1, padding: 20}}>
          <View style={styles.container}>
            <FlatList
              data={countryCodes}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
  },
  itemTxt: {
    color: '#000',
    padding: 14,
    fontSize: 16,
  },
});
