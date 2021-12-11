import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {styles} from 'react-native-markdown-renderer';
import THEME from '../../config/theme';
import {ShimmerLoader} from '../ShimmerLoader/ShimmerLoader';

const CardShimmer = ({request = false, blocked = false}) => {
  renderAbout = () => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width * 0.8,
          alignSelf: 'center',
          marginTop: 20,
          marginBottom: 20,
          height: 100,
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ShimmerLoader styles={{width: '40%', height: 15}} />
          <ShimmerLoader
            styles={{width: '20%', marginHorizontal: 20, height: 15}}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <ShimmerLoader styles={{width: '20%'}} />

          <ShimmerLoader styles={{width: '20%', marginLeft: 20, height: 15}} />

          <ShimmerLoader styles={{width: '20%', marginLeft: 20, height: 15}} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <ShimmerLoader styles={{width: '20%', height: 15}} />
          <ShimmerLoader styles={{width: '20%', marginLeft: 20, height: 15}} />
        </View>
      </View>
    );
  };

  const renderRequest = () => {
    return (
      <View style={{height: 50, flexDirection: 'row', marginHorizontal: 20}}>
        <ShimmerLoader styles={{width: '20%', height: 15}} />
        <ShimmerLoader styles={{width: '40%', height: 15, marginLeft: '10%'}} />
      </View>
    );
  };

  const renderLikeComment = () => {
    return blocked ? (
      <View
        style={{height: 50, flexDirection: 'row', justifyContent: 'center'}}>
        <ShimmerLoader
          styles={{
            height: 40,
            width: 130,
            marginHorizontal: 20,
            borderRadius: 20,
          }}
        />
      </View>
    ) : (
      <View
        style={{height: 50, flexDirection: 'row', justifyContent: 'center'}}>
        <ShimmerLoader
          styles={{
            height: 40,
            width: request ? 100 : 80,
            marginHorizontal: 20,
            borderRadius: 20,
          }}
        />
        <ShimmerLoader
          styles={{
            height: 40,
            width: request ? 100 : 80,
            marginHorizontal: 20,
            borderRadius: 20,
          }}
        />
      </View>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={['', '', '', '', '', '', '', '']}
      renderItem={(item) => {
        return (
          <View
            style={
              request
                ? [style.cardsContainer, {height: 550}]
                : style.cardsContainer
            }>
            <View style={{alignItems: 'center', marginTop: 20}}>
              <ShimmerLoader
                styles={{
                  width: Dimensions.get('window').width * 0.8,
                  height: 280,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              />
            </View>

            {renderAbout()}
            {request ? renderRequest() : null}
            {renderLikeComment()}
          </View>
        );
      }}
    />
  );
};

export default CardShimmer;

const style = StyleSheet.create({
  cardsContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    height: 500,
    backgroundColor: 'white',
  },
  text: {
    color: THEME.WHITE,
    fontSize: 14,
    padding: 5,
  },
  name: {
    fontSize: 16,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonLike: {
    backgroundColor: THEME.WHITE,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },

  reply: {
    backgroundColor: THEME.WHITE,
  },

  decline: {
    borderWidth: 1,
    borderColor: THEME.WHITE,
  },
  button: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
