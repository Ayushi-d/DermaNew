import React from 'react';
import {BackHandler} from 'react-native';

const CustomBackAction = (Component) => {
  return class CustomAppBackHandler extends React.Component {
    componentDidMount() {
      // this.didFocus = this.props.navigation.addListener('focus', (e) => {
      //   this.backHandler = BackHandler.addEventListener(
      //     'hardwareBackPress',
      //     this.customGoBack,
      //   );
      // });
      // this.willblur = this.props.navigation.addListener('beforeRemove', (e) => {
      //   this.backHandler.remove();
      // });
    }

    customGoBack = () => {
      let fromPage = this.props.route.params.fromPage;
      let fromPageHistory = this.props.route.params.fromPageHistory;
      let isData = this.props.route.params.returnData;
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

      if (this.backHandler) this.backHandler.remove();
    }
  };
};

export default CustomBackAction;
