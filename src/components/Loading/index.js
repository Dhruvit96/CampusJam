import React from 'react';
import {Button, Overlay} from 'react-native-elements';
import {fontscale} from '../../constants';
const Loading = ({isVisible}) => {
  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={{
        backgroundColor: 'transparent',
        elevation: 0,
      }}>
      <Button
        loading
        type="clear"
        loadingProps={{animating: true, size: fontscale(52)}}
      />
    </Overlay>
  );
};

export default Loading;
