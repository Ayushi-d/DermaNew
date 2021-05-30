import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import DateHelpers from '../../helpers/datehelpers';
import skin from '../../assets/profile/ic_skin.png';
import ring from '../../assets/profile/ic_ring.png';
import work from '../../assets/profile/ic_work.png';
import religion from '../../assets/profile/ic_religion.png';
import location from '../../assets/profile/ic_pin.png';
import edit from '../../assets/profile/ic_edit_copy.png';
import upload from '../../assets/profile/ic_uploadpic.png';
import THEME from '../../config/theme';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {BUTTON_WITH_PARAM} from '../general/button';
import {getData} from '../../config/parseuser';
import TrustScore from '../general/trustScore';
import {Interest, Loader, MultiChoicePicker} from '../modals';
import EP from '../../assets/data/ep';
import data from '../../assets/data/countryData';
import AboutMe from '../general/AboutMe';
import CustomBackAction from '../general/CustomBackAction';
import Header from '../Headers/SettingsHeader';
import {Chip} from 'react-native-paper';

const icon = {
  sc: skin,
  ms: ring,
  p: work,
  rl: religion,
  ct: location,
};

const myProfile = [
  [
    ['About Me'],
    [
      'Name',
      'Privacy Setting For Name',
      'Date of Birth',
      // 'Height',
      'Skin Condition',
      'Marital Status',
      'Children',
    ],
    ['Country', 'State', 'City'],
    ['Religion'],
    ['Highest Education', 'Education Field', 'Profession'],
    ['Interest'],
    ['Drink', 'Smoke', 'Diet'],
  ],
  [['Age', 'Skin Condition', 'Marital Status'], ['Location'], ['Religion']],
];

const profileData = {
  main: ['sc', 'ms', 'rl', 'p', 'ct,c'],
};

class MyProfileJSX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      religion: false,
      interest: false,
      location: false,
      loading: false,
    };
  }

  componentDidMount() {
    let tab = this.props.route.params.id;

    if (tab == 0 || tab == 1) {
      this.setState({tab});
    }

    if (tab == 1) {
      this.scrollView.scrollToEnd({animated: true});
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    let tab = this.props.route.params.id;

    if (tab == 0 || tab == 1) {
      this.setState({tab});
    }

    if (tab == 1) {
      this.scrollView.scrollToEnd({animated: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('update!', this.props.route.params.id);
    let tab = this.props.route.params.id;
    let prevTab = prevProps.route.params.id;

    if (tab !== prevTab) {
      if (tab == 0 || tab == 1) {
        this.setState({tab});
      }

      if (tab == 1) {
        this.scrollView.scrollToEnd({animated: true});
      }
    }
  }

  _onPressNavigate = (routeName, obj) => {
    if (obj.data == 'Interest') {
      this.setState({interest: true});
      return;
    }

    if (routeName == 'Edit Preference') {
      if (obj.data == 'Location') {
        // this.setState({location: true});
        // return;
      }

      if (obj.data == 'Religion') {
        // this.setState({religion: true});
        // return;
      }
    }

    console.log(routeName, obj);

    this.props.navigation.navigate(routeName, obj);
  };

  hideModal = (name) => {
    this.setState({[name]: false});
  };

  saveChanges = (data) => {
    this.setState({loading: true});
    this.props.context.saveToFirebase(data).then((res) => {
      this.setState({loading: false, interest: false});
    });
  };

  pushChangePP = (name, data) => {
    this.setState({location: false, religion: false, loading: true}, () => {
      if (name == 'Location') {
        this.props.context.savePPToFirebase({c: data}).then((res) => {
          this.setState({loading: false});
        });
      } else {
        this.props.context.savePPToFirebase({rl: data}).then((res) => {
          this.setState({loading: false});
        });
      }
    });
  };

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue}, () => {
      this.props.navigation.setParams({id: this.state.tab});
    });
  };

  renderTab = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: THEME.BORDERCOLOR,
        }}>
        <BUTTON_WITH_PARAM
          text={'MY PROFILE'}
          style={{width: '40%'}}
          checked={this.state.tab == 0}
          _onPress={this._onTabPress}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          text={'PARTNER PREFERENCE'}
          checked={!(this.state.tab == 0)}
          _onPress={this._onTabPress}
          pressParam={1}
        />
      </View>
    );
  };

  renderTrustScore = () => {
    return (
      <View style={ts.container}>
        <View style={ts.circularProgress}>
          <AnimatedCircularProgress
            size={100}
            width={15}
            fill={this.props.context.user ? this.props.context.user.ts.ts : 0}
            tintColor={THEME.GRADIENT_BG.END_COLOR}
            backgroundColor={'#dedede'}
            rotation={270}
            arcSweepAngle={180}>
            {(fill) => (
              <Text style={ts.ts}>
                {this.props.context.user
                  ? `${this.props.context.user.ts.ts}%`
                  : 0}
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={ts.tsText}>TRUST SCORE</Text>
        </View>
        <TrustScore
          ts={this.props.context.user ? this.props.context.user.ts : {}}
          _onPress={() => this._onPressNavigate('Trust Score', {})}
        />
      </View>
    );
  };

  renderProfile = () => {
    return (
      <View style={profile.container}>
        <View style={profile.uploadImage}>
          <TouchableOpacity
            style={profile.uploadContainer}
            onPress={() => this.props.navigation.navigate('Manage Photos')}>
            <Image
              source={{
                uri: this.props.context.user
                  ? this.props.context.user.ndp
                  : null,
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
            <Image source={upload} style={profile.upload} />
          </TouchableOpacity>
          <Text style={profile.name}>
            {this.props.context.user ? this.props.context.user['nm'] : ''}
          </Text>
          <Text style={profile.age}>
            {this.props.context.user
              ? `${DateHelpers.getAge(this.props.context.user['dob'])} Yrs`
              : ''}
          </Text>
        </View>

        <View style={profile.grid}>
          {profileData.main.map((item, i) => (
            <View key={i} style={[profile.gridItem]}>
              <Image source={icon[item.split(',')[0]]} style={[profile.icon]} />
              <Text>
                {this.props.context.user
                  ? item.split(',').length == 1
                    ? this.props.context.user[item]
                    : `${this.props.context.user[item.split(',')[0]]}, ${
                        this.props.context.user[item.split(',')[1]]
                      }`
                  : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  renderTabContent = () => {
    return (
      <View style={tabContent.container}>
        {myProfile[this.state.tab].map((item, i) => {
          return (
            <View style={tabContent.block} key={i}>
              {item.map((ch, index) => {
                let d = getData(
                  this.props.context.user,
                  ch,
                  this.state.tab == 1 ? true : false,
                );
                if (d == '' && ch != 'Interest' && ch != 'About Me')
                  return null;
                if (ch === 'Interest') {
                  let ins = getData(
                    this.props.context.user,
                    'Interest',
                    this.state.tab == 1 ? true : false,
                  );

                  let chips = ins.map((d) => (
                    <Chip style={{margin: 2, borderColor: '#222'}} key={d}>
                      {d}
                    </Chip>
                  ));

                  return (
                    <View style={tabContent.blockItem} key={index}>
                      <Text style={tabContent.ch}>{ch}</Text>
                      <View
                        style={{
                          padding: 10,
                          width: '100%',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        {chips && chips.length ? chips : null}
                      </View>
                    </View>
                  );
                }
                return (
                  <View style={tabContent.blockItem} key={index}>
                    <Text style={tabContent.ch}>{ch}</Text>
                    {ch == 'About Me' ? (
                      <AboutMe
                        style={tabContent.value}
                        data={getData(
                          this.props.context.user,
                          'ABOUT ME',
                          this.state.tab == 1 ? true : false,
                        )}
                      />
                    ) : (
                      <Text style={tabContent.value}>
                        {getData(
                          this.props.context.user,
                          ch,
                          this.state.tab == 1 ? true : false,
                        )}
                      </Text>
                    )}
                  </View>
                );
              })}
              {item[0] === 'Religion' && this.state.tab === 0 ? null : (
                <TouchableOpacity
                  style={tabContent.edit}
                  onPress={() =>
                    this._onPressNavigate(
                      this.state.tab == 0 ? 'Edit Profile' : 'Edit Preference',
                      {
                        data: item[0],
                      },
                    )
                  }>
                  <Image
                    source={edit}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      borderWidth: 1,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    return (
      <>
        <Header title={'My Profile'} type {...this.props} />
        <ScrollView
          style={{flex: 1}}
          ref={(ref) => {
            this.scrollView = ref;
          }}>
          {this.renderProfile()}
          {this.renderTrustScore()}
          {this.renderTab()}
          {this.renderTabContent()}
          {this.state.interest ? (
            <Interest
              isVisible={this.state.interest}
              onCancel={() => this.hideModal('interest')}
              saveChanges={this.saveChanges}
              data={getData(this.props.context.user, 'Interest').join(', ')}
            />
          ) : null}

          {/* Location */}
          {this.state.location ? (
            <MultiChoicePicker
              isVisible={this.state.location}
              data={["Doesn't matter", ...data]}
              title={'Location'}
              onCancelled={() => this.hideModal('location')}
              value={getData(this.props.context.user, 'Location', true)}
              saveChanges={(data) => this.pushChangePP('Location', data)}
            />
          ) : null}
          {/* Religion */}
          <MultiChoicePicker
            isVisible={this.state.religion}
            data={EP['pp']['Religion']}
            title={'Religion'}
            onCancelled={() => this.hideModal('religion')}
            value={getData(this.props.context.user, 'Religion', true)}
            saveChanges={(data) => this.pushChangePP('Religion', data)}
          />
          <Loader isVisible={this.state.loading} />
        </ScrollView>
      </>
    );
  }
}

const profile = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.BORDERCOLOR,
  },
  uploadImage: {
    alignItems: 'center',
  },
  name: {
    textAlign: 'center',
    color: THEME.PARAGRAPH,
    marginTop: 5,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  age: {
    color: THEME.GRAY,
    fontSize: 12,
  },
  upload: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  uploadContainer: {
    // height: 100,
    // width: 100,
  },

  grid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    width: '90%',
  },
  gridItem: {
    flexDirection: 'row',
    flexBasis: '50%',
    alignItems: 'center',
    marginVertical: 5,
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 10,
  },
});

const ts = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  circularProgress: {},
  ts: {
    color: THEME.GRADIENT_BG.START_COLOR,
    fontSize: 18,
    position: 'absolute',
    top: 15,
  },
  tsText: {
    position: 'absolute',
    top: 60,
    width: 100,
    textAlign: 'center',
    color: THEME.GRADIENT_BG.END_COLOR,
    fontSize: 15,
    fontWeight: '800',
  },
});

const tabContent = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
  },

  block: {
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  edit: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 10,
    top: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ch: {
    color: THEME.PARAGRAPH,
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: THEME.GRAY,
    marginTop: 2,
  },
  blockItem: {
    marginBottom: 20,
  },
});
const MyProfile = (props) => {
  return <MyProfileJSX {...props} />;
};

export default MyProfile;
