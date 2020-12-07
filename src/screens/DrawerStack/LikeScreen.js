import React from 'react';
import UserInterectionContext, {
  UserInterectionProvider,
} from '../../context/userInterection';
import Likes from '../../components/Likes';

class LikeScreen extends React.Component {
  render() {
    let {root} = this.props;
    return (
      <UserInterectionProvider mainContext={root.context}>
        <UserInterectionContext.Consumer>
          {(context) => <Likes context={context} {...this.props} />}
        </UserInterectionContext.Consumer>
      </UserInterectionProvider>
    );
  }
}

export default LikeScreen;
