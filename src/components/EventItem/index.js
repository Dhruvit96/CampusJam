import React, {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {fontscale, widthPercentageToDP} from '../../constants';
import Autolink from 'react-native-autolink';
class EventItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      lines: 0,
      textShown: false,
    };
  }

  render() {
    const _onTextLayout = (ref) => {
      this.setState({...this.state, lines: ref.nativeEvent.lines.length});
    };
    const _onPressReadMore = () => {
      this.setState({...this.state, textShown: true});
    };
    return (
      <View style={styles.container}>
        <Text style={styles.time}>{this.props.item.time}</Text>
        <Text style={styles.text}>{this.props.item.name}</Text>
        {this.props.item.details && (
          <>
            <Text
              style={styles.details}
              onTextLayout={_onTextLayout}
              numberOfLines={this.state.textShown ? this.state.lines : 3}>
              <Autolink
                text={this.props.item.details}
                linkStyle={{color: 'blue'}}
              />
            </Text>
            {this.state.lines > 3 && !this.state.textShown ? (
              <Text
                onPress={_onPressReadMore}
                style={{
                  fontSize: fontscale(13.5),
                  color: 'grey',
                }}>
                Read More
              </Text>
            ) : null}
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: widthPercentageToDP(3),
    marginBottom: widthPercentageToDP(1),
    padding: widthPercentageToDP(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: widthPercentageToDP(2),
    backgroundColor: 'white',
  },
  details: {
    fontSize: fontscale(13.5),
    marginBottom: widthPercentageToDP(1),
  },
  text: {
    fontSize: fontscale(14),
    marginTop: widthPercentageToDP(1),
    marginBottom: widthPercentageToDP(1),
  },
  time: {
    fontSize: fontscale(13),
  },
  url: {
    fontSize: fontscale(13.5),
    color: 'blue',
  },
});

export default EventItem;
