import React from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import {HeaderMain} from '../general/Header';
import Cards from '../cards/cards';
import DateHelpers from '../../helpers/datehelpers';
import auth from '@react-native-firebase/auth';

class LikeSent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  renderCards = () => {
    let data = this.props.context.sent;

    if (!data) return;
    let sortedKeys = Object.keys(data).sort(
      (a, b) =>
        data[b].lt[auth().currentUser.uid] - data[a].lt[auth().currentUser.uid],
    );
    return (
      <FlatList
        data={sortedKeys}
        renderItem={({item}) => (
          <Cards
            data={data[item]}
            fromLike={true}
            sent={true}
            dateToShow={DateHelpers.getDateFromTimeStamp(
              data[item].lf[auth().currentUser.uid],
            )}
            likesMe={this.LikesMe(data[item])}
            likeOther={true}
            fromPage={'Like Sent'}
            {...this.props}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{flexGrow: 1}}
      />
    );
  };

  LikesMe = (data) => {
    let lf = this.props.context.lf;
    if (lf && data) {
      return Object.keys(lf).includes(data.uid);
    }

    return false;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderMain routeName="Like Sent" {...this.props} />

        {this.renderCards()}
      </View>
    );
  }
}

export default LikeSent;
