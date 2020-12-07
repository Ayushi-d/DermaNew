import React from 'react';
import {BackHandler} from 'react-native';

const CustomBackAction = (Component) => {
  return class CustomAppBackHandler extends React.Component {
    componentDidMount() {
      this.didFocus = this.props.navigation.addListener('didFocus', (e) => {
        this.backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          this.customGoBack,
        );
      });

      this.willblur = this.props.navigation.addListener('willBlur', (e) => {
        this.backHandler.remove();
      });
    }

    customGoBack = () => {
      let fromPage = this.props.navigation.getParam('fromPage');
      let fromPageHistory = this.props.navigation.getParam('fromPageHistory');
      let isData = this.props.navigation.getParam('returnData');
      if (fromPage) {
        if (isData) {
          this.props.navigation.navigate(fromPage, {
            fromPage: fromPageHistory,
            data: {...isData},
          });
        } else {
          this.props.navigation.navigate(fromPage, {
            fromPage: fromPageHistory,
          });
        }
        return true;
      }

      return false;
    };

    render() {
      return <Component {...this.props} customGoBack={this.customGoBack} />;
    }

    componentWillUnmount() {
      if (this.didFocus) this.didFocus();

      if (this.willblur) this.willblur();

      if (this.backHandler) this.backHandler();
    }
  };
};

export default CustomBackAction;
