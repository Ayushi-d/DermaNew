import React from 'react';
import UserInterectionContext, {
  UserInterectionProvider,
} from '../../context/userInterection';
import Likes from '../../components/Likes';

class LikeScreen extends React.Component {
  render() {
    let {root} = this.props;
    let {route} = this.props;
    let page = route.params.id;
    return (
      <UserInterectionProvider mainContext={root.context} page={page}>
        <UserInterectionContext.Consumer>
          {(context) => (
            <Likes
              {...this.props}
              appContext={root.context}
              context={context}
            />
          )}
        </UserInterectionContext.Consumer>
      </UserInterectionProvider>
    );
  }
}

export default LikeScreen;
