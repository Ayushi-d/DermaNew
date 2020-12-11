import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import THEME from '../../config/theme';
import back from '../../assets/general/ic_back.png';
import home from '../../assets/general/ic_home.png';
import menu from '../../assets/general/ic_menu.png';
import blocked from '../../assets/MemberProfile/ic_blocked.png';
import {Dropdown} from 'react-native-material-dropdown-v2';
import ModalDrop from '../modals/ModalDrop';
import BlockUser from '../modals/block';
import ReportModal from '../modals/report';

let GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();
// let GRCOLOR = THEME.GRADIENT_BG.PAIR;
const HeaderBG = () => (
  <LinearGradient
    colors={GRCOLOR}
    style={{flex: 1}}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
  />
);

/**
 *
 * @param {routeName} routeName -> Title of the header
 * @param navigationProps => {...props}
 */
const HeaderMain = (props) => (
  <LinearGradient
    colors={GRCOLOR}
    style={style.headerMain}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}>
    <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
      <Image source={menu} style={[style.image, {marginLeft: 10}]} />
    </TouchableOpacity>

    <Text style={style.route}>{props.routeName}</Text>
    <TouchableOpacity onPress={() => props.navigation.navigate('Dashboard')}>
      <Image source={home} style={[style.image, {marginRight: 10}]} />
    </TouchableOpacity>
  </LinearGradient>
);

const CustomHeaderStack = (props) => (
  <LinearGradient
    colors={GRCOLOR}
    style={[style.headerMain, {paddingHorizontal: 10}]}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}>
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        padding: 5,
      }}>
      <Image
        source={back}
        style={[style.image, {marginLeft: 10, width: 15, height: 15}]}
      />
    </TouchableOpacity>

    <Text style={[style.route, {fontSize: 14}]}>{props.title}</Text>
  </LinearGradient>
);

class MemberHeader extends React.Component {
  data = [{value: 'Report'}, {value: 'Block'}];

  state = {
    show: false,
    x: 0,
    y: 0,
    blockShow: false,
    reportShow: false,
  };

  showModal = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
    this.setState({show: true, x, y});
  };

  hideModal = () => {
    this.setState({show: false});
  };

  reportShow = () => {
    this.setState({reportShow: !this.state.reportShow, show: false});
  };

  blockShow = () => {
    this.setState({blockShow: !this.state.blockShow, show: false});
  };

  render() {
    const {props} = this;
    return (
      <LinearGradient
        colors={GRCOLOR}
        style={style.headerMain}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <TouchableOpacity onPress={props.customGoBack}>
          <Image source={back} style={[style.image, {marginLeft: 10}]} />
        </TouchableOpacity>

        <Text style={style.route}>{props.routeName}</Text>
        <TouchableOpacity
          onPress={(evt) =>
            this.showModal(evt.nativeEvent.pageX, evt.nativeEvent.pageY)
          }>
          <Image source={blocked} style={[style.image, {marginRight: 10}]} />
        </TouchableOpacity>
        <ModalDrop
          isVisible={this.state.show}
          x={this.state.x}
          y={this.state.y}
          reportShow={this.reportShow}
          blockShow={this.blockShow}
          hideModal={this.hideModal}
        />
        {this.state.blockShow ? (
          <BlockUser
            isVisible={this.state.blockShow}
            blockToggle={this.blockShow}
            userToBlock={this.props.route.params.data.uid}
          />
        ) : null}
        {this.state.reportShow ? (
          <ReportModal
            isVisible={this.state.reportShow}
            reportToggle={this.reportShow}
            userToReport={this.props.route.params.data.uid}
          />
        ) : null}
      </LinearGradient>
    );
  }
}

class MemberHeaderForStack extends React.Component {
  data = [{value: 'Report'}, {value: 'Block'}];

  state = {
    show: false,
    x: 0,
    y: 0,
    blockShow: false,
    reportShow: false,
  };

  showModal = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
    this.setState({show: true, x, y});
  };

  hideModal = () => {
    this.setState({show: false});
  };

  reportShow = () => {
    this.setState({reportShow: !this.state.reportShow, show: false});
  };

  blockShow = () => {
    this.setState({blockShow: !this.state.blockShow, show: false});
  };

  render() {
    const {props} = this;
    return (
      <View>
        <TouchableOpacity
          onPress={(evt) =>
            this.showModal(evt.nativeEvent.pageX, evt.nativeEvent.pageY)
          }>
          <Image source={blocked} style={[style.image, {marginRight: 10}]} />
        </TouchableOpacity>
        <ModalDrop
          isVisible={this.state.show}
          x={this.state.x}
          y={this.state.y}
          reportShow={this.reportShow}
          blockShow={this.blockShow}
          hideModal={this.hideModal}
        />
        {this.state.blockShow ? (
          <BlockUser
            isVisible={this.state.blockShow}
            blockToggle={this.blockShow}
          />
        ) : null}
        {this.state.reportShow ? (
          <ReportModal
            isVisible={this.state.reportShow}
            reportToggle={this.reportShow}
          />
        ) : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  headerMain: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    alignSelf: 'center',
    backgroundColor: THEME.WHITE,
  },
  image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  route: {
    color: THEME.WHITE,
    marginRight: 'auto',
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
  },
});

export {
  HeaderBG,
  HeaderMain,
  MemberHeader,
  MemberHeaderForStack,
  CustomHeaderStack,
};
