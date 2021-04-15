import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import DermaLogo from '../../assets/splash/dc_logo.png';
import THEME from '../../config/theme';
import {normalize} from './getScale';

const Info = [
  'Dating and Matchmaking App for people with skin condition.',
  'Discover a partner with similar life experiences for better understanding, comfort & mutual respect',
  'People without any skin condition are welcome to join in if they are open to date someone with a skin condition.',
  'Yola baby',
];

const {width} = Dimensions.get('window');

class Carousel extends React.Component {
  scrollX = new Animated.Value(0);

  constructor(props) {
    super(props);
  }

  render() {
    let position = Animated.divide(this.scrollX, width);
    return (
      <View style={carousel.parent}>
        <Pager position={position} />
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.scrollX}}}],
            {
              useNativeDriver: false,
            },
          )}>
          {[
            <AppInfoText key={1} text={Info[0]} />,
            <AppInfoText key={2} text={Info[1]} />,
            <Tags key={3} />,
            <AppInfoText key={4} text={Info[2]} />,
          ]}
        </ScrollView>
      </View>
    );
  }
}

const Tags = () => (
  <View style={carousel.tagParent}>
    <Text
      style={{
        textAlign: 'center',
        fontSize: normalize(16),
        fontWeight: '600',
        color: THEME.WHITE,
        marginBottom: 10,
      }}>
      Skin Condition wise matching profile
    </Text>
    <View style={carousel.sameHeight}>
      <Text style={carousel.tag}>Vitiligo</Text>
      <Text style={carousel.tag}>Psoriasis</Text>
    </View>
    <View style={carousel.sameHeight}>
      <Text style={carousel.tag}>Acne</Text>
      <Text style={carousel.tag}>Burn / Scar</Text>
    </View>
    <View style={carousel.sameHeight}>
      <Text style={carousel.tag}>Eczema</Text>
      <Text style={carousel.tag}>Dermatitis</Text>
    </View>
    <View style={carousel.sameHeight}>
      <Text style={carousel.tag}>Albinism</Text>
      <Text style={carousel.tag}>Alopecia</Text>
    </View>
    <View style={carousel.sameHeight}>
      <Text style={{...carousel.tag, ...carousel.expanded}}>
        Other Skin Conditions
      </Text>
    </View>
  </View>
);

const AppInfoText = (props) => (
  <View style={carousel.fullWidth}>
    <Text style={carousel.info}>{props.text}</Text>
    <Image source={DermaLogo} style={carousel.logo} />
  </View>
);

const Pager = (props) => (
  <View style={carousel.pager}>
    {Info.map((_, i) => {
      let opacity = props.position.interpolate({
        inputRange: [i - 1, i, i + 1],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      return (
        <Animated.View
          key={i}
          style={{
            opacity,
            height: 10,
            width: 10,
            backgroundColor: THEME.WHITE,
            margin: 8,
            borderRadius: 5,
          }}
        />
      );
    })}
  </View>
);

const carousel = StyleSheet.create({
  parent: {
    height: '50%',
  },
  fullWidth: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'space-around',
    // borderWidth: 1
  },
  info: {
    fontSize: normalize(16),
    color: THEME.WHITE,
    fontWeight: '600',
    textAlign: 'center',
    width: '80%',
  },

  logo: {
    width: '70%',
    height: 120,
    resizeMode: 'cover',
  },
  pager: {
    // position: 'absolute',
    height: '100%',
    // top: 0,
    height: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sameHeight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  tagParent: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: THEME.WHITE,
    color: 'black',
    width: 100,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 2,
  },
  expanded: {
    width: 200,
  },
});

export default Carousel;
