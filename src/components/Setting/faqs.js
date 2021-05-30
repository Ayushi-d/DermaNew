import React from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import md from '../../assets/data/FAQs';
import Markdown, {getUniqueID, openUrl} from 'react-native-markdown-renderer';
import THEME from '../../config/theme';
import {HeaderMain} from '../general/Header';
import LegalDataParse from '../../helpers/LegalDataParse';
import SettingsHeader from '../Headers/SettingsHeader';

class FAQ extends React.Component {
  navigateTo = (screen) => {
    this.props.navigation.navigate(screen);
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
      return (
        <Text
          key={node.key}
          style={styles.em}
          onPress={() =>
            this.navigateTo(LegalDataParse[children[0].props.children])
          }>
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

  // renderHeader = () => {
  //   return null;
  //   let data = this.props.navigation.getParam('hideHeader');
  //   console.log(data, 'aaa');
  //   if (data) return null;
  //   return (
  //     <HeaderMain routeName={'Frequently Asked Questions'} {...this.props} />
  //   );
  // };

  render() {
    return (
      <View>
        {/* {this.renderHeader()} */}
        {/* <SettingsHeader title={'FAQs'} {...this.props} /> */}
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
export default FAQ;
