import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import THEME from '../../config/theme';
import close from '../../assets/MemberProfile/close.png';
import ViewPager from '@react-native-community/viewpager';

class ImageFullScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      urls: [],
    };
  }

  componentDidMount() {
    this.props.urls.map(item => {
      Image.getSize(item, (width, height) => {
        let urls = [...this.state.urls];
        let ar = width / height;
        urls.push(ar);
        this.setState({urls});
      });
    });
  }

  onSwipe = x => {
    this.setState({current: x + 1});
  };

  render() {
    return (
      <ReactNativeModal
        isVisible={this.props.isVisible}
        backdropOpacity={1}
        style={{padding: 0, margin: 0}}
      >
        <TouchableOpacity
          style={{
            width: 20,
            height: 20,
            alignSelf: 'flex-end',
            marginTop: 20,
            marginRight: 20,
          }}
          onPress={this.props.toggleModal}
        >
          <Image source={close} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        <Text style={{color: THEME.WHITE, textAlign: 'center', fontSize: 16}}>
          {`${this.state.current} OF ${this.props.urls.length}`}
        </Text>
        <ViewPager
          style={{
            flex: 1,
          }}
          initialPage={this.props.index}
          onPageScroll={evt => this.onSwipe(evt.nativeEvent.position)}
        >
          {this.props.urls.map((item, index) => (
            <View
              key={index}
              style={{alignItems: 'center', justifyContent: 'center'}}
            >
              <Image
                source={{uri: item}}
                style={{
                  width: Dimensions.get('window').width,
                  aspectRatio: this.state.urls[index] || 2 / 3,
                  padding: 5,
                }}
              />
            </View>
          ))}
        </ViewPager>
      </ReactNativeModal>
    );
  }
}

export default ImageFullScreen;
