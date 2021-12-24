import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Text, View, TextInput} from 'react-native';
import {ShimmerLoader} from '../ShimmerLoader/ShimmerLoader';

const ChatShimmer = ({chat = false}) => {
  const _renderItem = () => {
    return (
      <View style={styles.mainView}>
        <View style={{flexDirection: 'row'}}>
          <ShimmerLoader styles={{height: 50, width: 50, borderRadius: 25}} />
          <View
            style={{
              justifyContent: 'space-around',
              marginLeft: '5%',
              width: '60%',
            }}
          >
            <ShimmerLoader styles={styles.width50} />
            <ShimmerLoader styles={chat ? styles.width100 : styles.width50} />
          </View>
        </View>
        <View style={{marginTop: '2%'}}>
          <ShimmerLoader styles={{width: '30%'}} />
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{marginTop: 5}}>
        <FlatList
          data={['', '', '', '', '', '', '', '', '', '', '']}
          renderItem={_renderItem}
        />
      </View>
    </>
  );
};
export default ChatShimmer;

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
  width50: {
    width: '70%',
  },
  width100: {
    width: '100%',
  },
});
