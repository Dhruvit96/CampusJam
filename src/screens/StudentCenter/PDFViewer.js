import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from '../../constants';
import Pdf from 'react-native-pdf';

const PDFViewer = ({route}) => {
  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <Pdf
        source={{
          uri: route.params.pdf,
        }}
        horizontal
        enablePaging
        fitWidth
        enableRTL
        style={styles.pdf}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
  },
});

export default PDFViewer;
