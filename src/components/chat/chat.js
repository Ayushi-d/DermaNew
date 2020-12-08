import React from 'react';
import {View, FlatList} from 'react-native';
import {BUTTON_WITH_PARAM} from '../general/button';
import Cards from '../cards/cards';
import DateHelpers from '../../helpers/datehelpers';
import Header from '../Headers/SettingsHeader';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let id = props.route.params.i;
    if (id == 'Regular' || id == 'default') {
      this.setState({tab: 0});
    }

    if (id == 'Filtered Out') {
      this.setState({tab: 1});
    }
  }

  componentDidMount() {
    let id = this.props.route.params.id;

    if (id == 'Regular' || id == 'default') {
      this.setState({tab: 0});
    }

    if (id == 'Filtered Out') {
      this.setState({tab: 1});
    }
  }

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue}, () => {
      this.props.navigation.setParams({
        id: this.state.tab == 0 ? 'Regular' : 'Filtered Out',
      });
    });
  };

  navigateToMessageScreen = (data, item) => {
    this.props.navigation.navigate('Message', {data: data, key: item});
  };

  renderTab = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 20,
        }}>
        <BUTTON_WITH_PARAM
          text={'Regular'}
          style={{width: '40%'}}
          checked={this.state.tab == 0}
          _onPress={this._onTabPress}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          style={{width: '40%'}}
          text={'Filtered Out'}
          checked={!(this.state.tab == 0)}
          _onPress={this._onTabPress}
          pressParam={1}
        />
      </View>
    );
  };

  LikesMe = (data) => {
    let other_user = data.user_data;
    let lf =
      this.props.appContext.user_data && this.props.appContext.user_data.lf;
    if (lf && data) {
      return Object.keys(lf).includes(other_user.uid);
    }

    return false;
  };

  renderChatReqCards = () => {
    let data =
      this.state.tab == 0
        ? this.props.context.regular
        : this.props.context.filteredOut;

    if (!data) return null;

    if (Object.keys(data).length == 0) return null;

    return (
      <FlatList
        data={Object.keys(data)}
        renderItem={({item}) => (
          <Cards
            data={data[item].user_data}
            hideButton={true}
            sent={this.state.tab == 1}
            message={data[item].lm.mg}
            fromChat={true}
            navigation={this.props.navigation}
            likesMe={this.LikesMe(data[item])}
            dateToShow={DateHelpers.getDateFromTimeStamp(data[item].lm.tp)}
            messageRefKey={data[item].keyRef}
            fromPage={'Chat Request'}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{flexGrow: 1}}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header title={'CHAT REQUESTS'} {...this.props} />
        {this.renderTab()}
        {this.renderChatReqCards()}
      </View>
    );
  }
}

export default Chat;
