import React, {useCallback, useState} from 'react';
import {Text} from 'react-native';
import THEME from '../../config/theme';

const AboutMe = props => {
  const NUM_LINES = 4;
  const [showReadMore, setShowReadMore] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const _onTextLayout = useCallback(e => {
    let LINES = e.nativeEvent.lines.length;
    setShowReadMore(LINES >= NUM_LINES);
  }, []);

  return (
    <React.Fragment>
      <Text
        numberOfLines={showReadMore && !showMore ? NUM_LINES : 0}
        onTextLayout={_onTextLayout}
        style={{
          fontSize: 15,
          color: THEME.PARAGRAPH,
          marginTop: 2,
          textAlign: 'justify',
        }}
      >
        {props.data}
      </Text>
      {showReadMore ? (
        <Text
          style={{
            color: THEME.GRADIENT_BG.END_COLOR,
            paddingVertical: 5,
          }}
          onPress={() => setShowMore(!showMore)}
        >
          {!showMore ? 'Read More' : 'Show Less'}
        </Text>
      ) : null}
    </React.Fragment>
  );
};

export default AboutMe;
