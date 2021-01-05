import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  BackHandler,
  Settings,
} from 'react-native';
import md from '../../assets/data/privacy';
import Markdown, {getUniqueID, openUrl} from 'react-native-markdown-renderer';
import THEME from '../../config/theme';
import SettingsHeader from '../Headers/SettingsHeader';

class PrivacyPolicy extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    console.log('unmounting');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    let from = this.props.route.params ? this.props.route.params.from : '';
    console.log(from);

    if (from) {
      this.props.navigation.navigate(from, 'from');
      return true;
    } else {
      this.props.navigation.goBack();
      return true;
    }
  };

  rules = {
    textgroup: (node, children, parent, styles) => {
      return (
        <Text key={node.key} style={styles.text}>
          {children}
        </Text>
      );
    },
    heading1: (node, children, parent, styles) => (
      <Text key={getUniqueID()} style={[styles.heading, styles.heading1]}>
        {children}
      </Text>
    ),
    blockquote: (node, children, parent, styles) => (
      <View key={node.key} style={styles.blockquote}>
        {children}
      </View>
    ),
    em: (node, children, parent, styles) => {
      // implement navigation here
      console.log('here');
      return (
        <Text key={node.key} style={styles.em}>
          {children}
        </Text>
      );
    },
    strong: (node, children, parent, styles) => {
      return (
        <Text key={node.key} style={[styles.strong]}>
          {children}
        </Text>
      );
    },
    softbreak: (node, children, parent, styles) => (
      <Text key={node.key}> </Text>
    ),

    link: (node, children, parent, styles) => {
      return (
        <Text
          key={node.key}
          style={styles.link}
          onPress={() => openUrl(node.attributes.href)}>
          {children}
        </Text>
      );
    },
  };
  render() {
    let {params} = this.props.route;
    return (
      <View>
        <SettingsHeader
          title={'Privacy Policy'}
          hideRight={params && params.from === 'Registration'}
          {...this.props}
        />
        <ScrollView>
          <View style={style.container}>
            <Markdown style={mdStyle} rules={this.rules}>
              {md}
            </Markdown>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mdStyle = StyleSheet.create({
  heading1: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    marginBottom: 30,
  },
  heading2: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    marginBottom: 30,
  },
  strong: {
    color: 'black',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'justify',
    lineHeight: 25,
    padding: 5,
    marginBottom: 10,
  },
  link: {
    color: THEME.GRADIENT_BG.END_COLOR,
  },
  paragraph: {
    color: 'red',
  },
  em: {
    color: THEME.GRADIENT_BG.END_COLOR,
  },
});

const style = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
  },
});
export default PrivacyPolicy;
