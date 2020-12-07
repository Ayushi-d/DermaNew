import React from 'react';

import {
  FilterOutContext,
  FilterOutContextProvider,
} from '../../context/FilterOutContext';
import FilterOut from '../../components/FilterOut/';

class FilterOutScreen extends React.Component {
  render() {
    let {root} = this.props;

    return (
      <FilterOutContextProvider mainContext={root.context}>
        <FilterOutContext.Consumer>
          {(context) => <FilterOut context={context} {...this.props} />}
        </FilterOutContext.Consumer>
      </FilterOutContextProvider>
    );
  }
}

export default FilterOutScreen;
