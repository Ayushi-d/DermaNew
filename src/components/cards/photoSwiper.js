import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import banner from '../../assets/cards/ic_ribbin.png';
import likeButton from '../../assets/cards/ic_button_like.png';
import chatButton from '../../assets/cards/ic_chat.png';

import THEME from '../../config/theme';
import LinearGradient from 'react-native-linear-gradient';
import ImageFullScreen from '../modals/ImageFullScreen';
// import {withNavigation} from 'react-navigation';

import ViewPager from '@react-native-community/viewpager';

const DUMMY_DP =
  'https://firebasestorage.googleapis.com/v0/b/derma-cupid.appspot.com/o/images%2FNew%20User%2FProfile-ICon.png?alt=media&token=3a84752a-9c6e-4dcd-b31a-aec8675d55c1';

import FastImage from 'react-native-fast-image';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
class PhotoSwiper extends React.Component {
  scrollX = new Animated.Value(0);

  position = new Animated.Value(0);

  index = 0;

  constructor(props) {
    super(props);
    let urls = [];
    let dp = props.data.dp;
    urls.push(dp);
    let otherpics = props.data.op ? Object.values(props.data.op) : [];
    if (otherpics) {
      if (otherpics.length > 0) {
        for (let pic of otherpics) {
          if (pic && pic != dp) {
            urls.push(pic);
          }
        }
      }
    }

    this.state = {
      urls: urls,
      gender: props.data.g,
      fullscreen: false,
      scroll: false,
      dragging: 'idle',
      index: 0,
    };
  }

  componentDidMount() {
    let {navigation} = this.props;
    this.willFocusSubscription =
      navigation &&
      navigation.addListener('focus', (payload) => {
        this.ref.setPage(0);
      });
  }

  componentWillUnmount() {
    if (this.willFocusSubscription) this.willFocusSubscription();
  }

  UNSAFE_componentWillReceiveProps(newprops) {
    let urls = [];
    let dp = newprops.data.dp;
    urls.push(dp);
    let otherpics = newprops.data.op ? Object.values(newprops.data.op) : [];
    if (otherpics) {
      if (otherpics.length > 0) {
        for (let pic of otherpics) {
          if (pic && pic != dp) {
            urls.push(pic);
          }
        }
      }
    }
    this.setState({
      urls,
      gender: newprops.data.g,
    });
  }

  renderBanner = () => {
    return (
      <ImageBackground
        source={banner}
        style={{
          width: 53,
          height: 71,
          position: 'absolute',
          left: 20,
          alignItems: 'center',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            color: THEME.WHITE,
            marginTop: 5,
            fontSize: 14,
          }}>
          {this.props.data.ts ? this.props.data.ts.ts : 0}%
        </Text>
        <Text style={{fontSize: 14, textAlign: 'center', color: THEME.WHITE}}>
          {'Trust\nScore'}
        </Text>
      </ImageBackground>
    );
  };

  renderPager = () => {
    return (
      <View style={style.pager}>
        {this.state.urls.length > 1 &&
          this.state.urls.map((_, i) => {
            return (
              <Animated.View
                key={i}
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor:
                    this.state.index == i
                      ? THEME.GRADIENT_BG.END_COLOR
                      : THEME.WHITE,
                  margin: 5,
                  borderRadius: 15,
                }}
              />
            );
          })}
      </View>
    );
  };

  renderTopRight = () => {
    return this.props.dateToShow ? (
      <LinearGradient
        colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          position: 'absolute',
          top: 20,
          right: 0,
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: THEME.WHITE, fontSize: 12}}>
          {this.props.dateToShow}
        </Text>
      </LinearGradient>
    ) : null;
  };

  renderBottomLeft = () => {
    return (
      <LinearGradient
        colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          position: 'absolute',
          bottom: 50,
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: THEME.WHITE, fontSize: 14}}>
          {this.state.gender == 'Male' ? 'He likes you' : 'She likes you'}
        </Text>
      </LinearGradient>
    );
  };

  renderBottomRight = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: -26,
          right: 0,
        }}>
        <TouchableOpacity>
          <Image source={likeButton} style={style.floatingButton} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={chatButton} style={style.floatingButton} />
        </TouchableOpacity>
      </View>
    );
  };

  showImageFullScreen = () => {
    // show Image full screen only in member profile screen
    if (!this.props.fromMember) {
      this.props._navigateToMember();
      return;
    }

    if (this.state.urls.length == 1 && this.state.urls[0] == DUMMY_DP) {
      return false;
    }

    this.setState({fullscreen: !this.state.fullscreen});
  };

  render() {
    return (
      <View style={style.container}>
        <ViewPager
          ref={(ref) => (this.ref = ref)}
          initialPage={0}
          style={{width: width * 0.8, borderWidth: 1}}
          showPageIndicator={false}
          onPageScroll={(evt) => {
            this.setState({index: evt.nativeEvent.position});
          }}
          onPageScrollStateChanged={(evt) =>
            this.setState({dragging: evt.nativeEvent.pageScrollState})
          }
        >
          {this.state.urls.map((url, i) => (
            <TouchableWithoutFeedback
              key={i}
              onPress={() => {
                if (this.state.dragging == 'idle') this.showImageFullScreen();
              }}>
              {/* <Image
                source={{uri: url}}
                style={{
                  width: width * 0.8,
                  resizeMode: 'cover',
                  aspectRatio: 3 / 2,
                  borderRadius: 3,
                }}
              /> */}
              <View style={{width: width * 0.8}}>
                {/* <FastImage
                  source={{uri: url}}
                  style={{
                    width: '100%',
                    height: width * 0.8,
                    resizeMode: 'contain',
                    aspectRatio: 3 / 2,
                    borderRadius: 3,
                    backgroundColor: '#fff',
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                /> */}

                <CardImage source={{uri: url}} />
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ViewPager>
        {!this.props.hideTopLeft ? this.renderBanner() : null}
        {!this.props.hideBottomLeft && this.props.likesMe
          ? this.renderBottomLeft()
          : null}
        {!this.props.hideTopRight ? this.renderTopRight() : null}

        {!this.props.hideBottomRight ? this.renderBottomRight() : null}
        {this.renderPager()}
        {this.state.fullscreen ? (
          <ImageFullScreen
            isVisible={this.state.fullscreen}
            urls={this.state.urls}
            toggleModal={this.showImageFullScreen}
            index={this.state.index}
          />
        ) : null}
      </View>
    );
  }
}

class CardImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View
        style={{
          width: width * 0.8,
          height: width,
          borderRadius: 5,
        }}>
        {/*{!this.state?.loaded ? (*/}
        {!this.state.loaded ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            <ShimmerPlaceholder
              style={{
                width: width * 0.8,
                height: width,
              }}
            />
          </View>
        ) : null}

        <FastImage
          source={{uri: this.props.source.uri}}
          style={{
            width: width * 0.8,
            height: width * 0.8,
            // aspectRatio: 3 / 2,
            borderRadius: 5,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onLoadStart={() => this._isMounted && this.setState({loaded: false})}
          onLoadEnd={() => this._isMounted && this.setState({loaded: true})}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: width * 0.8,
    height: 300,
    overflow: 'hidden',
  },

  floatingButton: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
    pager: {
        position: 'absolute',
        height: '100%',
        bottom: 20,
        height: 20,
        width: '50%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
  // pager: {
  //   position: 'absolute',
  //   height: '100%',
  //   bottom: 20,
  //   // height: 20,
  //   width: '50%',
  //   alignSelf: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});

export default PhotoSwiper;
