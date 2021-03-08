import React, {useState} from 'react';
import {Alert, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {fontscale, widthPercentageToDP} from '../../constants';

const PlacementItem = ({item}) => {
  const [line, setLine] = useState(0);
  const handleClick = () => {
    Linking.canOpenURL(item.url).then((supported) => {
      if (supported) {
        Linking.openURL(item.url);
      } else {
        Alert.alert('Error', "Can't open this URL.");
      }
    });
  };
  const _onTextLayout = (ref) => {
    setLine(ref.nativeEvent.lines.length);
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 10, alignItems: 'center', justifyContent: 'center'}}>
        {line > 1 ? (
          <>
            <Text style={styles.text}>{item.firstName}</Text>
            <Text style={styles.text}>{item.lastName}</Text>
          </>
        ) : (
          <Text style={styles.text} onTextLayout={_onTextLayout}>
            {item.firstName + ' ' + item.lastName}
          </Text>
        )}
        <Text style={styles.text}>{item.id}</Text>
      </View>
      <View
        style={{
          flex: 15,
          justifyContent: 'center',
          marginStart: widthPercentageToDP(2),
        }}>
        <Text style={styles.text}>{'Passing year: ' + item.year}</Text>
        <Text style={styles.text}>{'Department: ' + item.department}</Text>
        <TouchableOpacity
          onPress={item.url ? handleClick : null}
          disabled={!item.url}>
          <Text style={styles.text}>{'Company: ' + item.company}</Text>
        </TouchableOpacity>
        {item.package && (
          <Text style={styles.text}>{'Package: ' + item.package + ' LPA'}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: widthPercentageToDP(3),
    marginBottom: widthPercentageToDP(1),
    padding: widthPercentageToDP(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: widthPercentageToDP(2),
    backgroundColor: 'white',
  },
  text: {
    fontSize: fontscale(15),
  },
});

export default PlacementItem;
