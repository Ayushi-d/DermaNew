import React from 'react';
import UserInterectionContext, {
  UserInterectionProvider,
} from '../../context/userInterection';
import LikeSent from '../../components/Likes/likeSent';

class LikeSentScreen extends React.Component {
  render() {
    let {root} = this.props;
    let page = this.props.route.params.id;
    return (
      <UserInterectionProvider mainContext={root.context} page={page}>
        <UserInterectionContext.Consumer>
          {(context) => (
            <LikeSent
              appContext={root.context}
              {...this.props}
              context={context}
            />
          )}
        </UserInterectionContext.Consumer>
      </UserInterectionProvider>
    );
  }
}

export default LikeSentScreen;
