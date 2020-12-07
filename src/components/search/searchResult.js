import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
// import {HeaderMain} from '../general/Header';
import Snackbar from 'react-native-snackbar';
import Cards from '../cards/cards';
import THEME from '../../config/theme';
import PP from '../../helpers/pp';
import {Loader} from '../modals';
// import {NavigationActions} from 'react-navigation';

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      refreshing: false,
      data: {},
      endReached: false,
      loadMore: false,
      onEndReachedCalledDuringMomentum: true,
    };
  }

  componentDidMount() {
    let user = this.props.route.params.user;
    this.pp = new PP(2, user || {});
    this.fetchUser();
  }

  // UNSAFE_componentWillReceiveProps(props) {
  //   this.refreshList();
  // }

  fetchUser = async () => {
    this.setState({loading: true}, async () => {
      let users = await this.pp.getUsers();
      if (users && Object.keys(users).length != 0) {
        this.setData(users);
      } else {
        this.setState({loading: false}, () => {
          alert('No Matching users found');
        });
      }
    });
  };

  loadMore = async () => {
    if (this.state.onEndReachedCalledDuringMomentum) return null;

    this.setState({loadMore: true});

    let users = await this.pp.getUsers();
    if (users && Object.keys(users).length != 0) {
      this.setData(users);
    } else {
      Snackbar.show({
        title: 'You have reached to the end of the matched users list.',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    this.setState({loadMore: false, onEndReachedCalledDuringMomentum: true});
  };

  setData = (obj) => {
    let keys = Object.keys(obj);

    let data = {...this.state.data};

    let list = Object.keys(data); // 0

    keys.map((item) => {
      data[item] = obj[item];
    });

    this.setState({data, loading: false, refreshing: false}); // if got minimum items then set it
  };

  refreshList = async () => {
    // user from props
    let user = this.props.route.params.user;

    this.setState({refreshing: true, data: {}}, async () => {
      this.pp = new PP(2, user || {});
      let users = await this.pp.getUsers();
      if (users && Object.keys(users).length != 0) {
        this.setData(users);
      } else {
        this.setState({refreshing: false}, () => {
          alert('No Users Found!');
        });
      }
    });
  };

  _onMomentumScrollBegin = () =>
    this.setState({onEndReachedCalledDuringMomentum: false});

  renderCards = () => {
    let data = this.state.data;

    if (!data) return null;
    let sortedKeys = Object.keys(data).sort(
      (a, b) => data[b].cat - data[a].cat,
    );

    return (
      <FlatList
        data={sortedKeys}
        renderItem={({item}) => (
          <Cards
            data={data[item]}
            fromLike={true}
            sent={this.state.tab == 1}
            likesMe={this.LikesMe(data[item])}
            fromSearchResult={true}
            navigation={this.props.navigation}
            fromPage={'Search Result'}
            likeOther={this.likeOther(data[item])}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.03}
        refreshing={this.state.refreshing}
        ListFooterComponent={this.renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        onRefresh={this.refreshList}
        onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
      />
    );
  };

  LikesMe = (data) => {
    let user = this.props.context.user;
    let lf = user.lf;
    if (lf && data) {
      return Object.keys(lf).includes(data.uid);
    }

    return false;
  };

  likeOther = (data) => {
    let user = this.props.context.user;
    let lt = user.lt;
    if (lt && data) {
      return Object.keys(lt).includes(data.uid);
    }

    return false;
  };

  renderFooter = () => {
    return this.state.loadMore ? (
      <ActivityIndicator
        size={'large'}
        color={THEME.GRADIENT_BG.END_COLOR}
        animating
      />
    ) : null;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderCards()}
        {this.state.loading ? <Loader isVisible={this.state.loading} /> : null}
      </View>
    );
  }
}

export default SearchResult;
