import React from 'react';
import UserInterectionContext, {
  UserInterectionProvider,
} from '../../context/userInterection';
import LikeSent from '../../components/Likes/likeSent';

class LikeSentScreen extends React.Component {
  render() {
    let {root} = this.props;
    return (
      <UserInterectionProvider mainContext={root.user}>
        <UserInterectionContext.Consumer>
          {(context) => <LikeSent context={context} {...this.props} />}
        </UserInterectionContext.Consumer>
      </UserInterectionProvider>
    );
  }
}

export default LikeSentScreen;
