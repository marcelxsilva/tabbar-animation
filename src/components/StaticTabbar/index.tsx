import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Dimensions, Animated } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
interface Tab {
  name: string,
}
interface Props {
  tabs: Tab[],
  value: Animated.Value
}
export const tabHeight = 70;
const { width } = Dimensions.get('window');

export default class StaticTabbar extends Component<Props> {

  onPress = (index: number) => {
    const { value, tabs } = this.props;
    const tabWidth = width / tabs.length;
    Animated.spring(value, {
      toValue: -width + tabWidth * index,
      useNativeDriver: true,
    }).start()
  }

  render() {
    const { tabs, value } = this.props;
    const tabWidth = width / tabs.length;
    return (
      <View style={styles.container}>
        {
          tabs.map(({ name }, index) => {
            const opacity = value.interpolate({
              inputRange: [
                -width + tabWidth * (index - 1),
                -width + tabWidth * index,
                -width + tabWidth * (index + 1),
              ],
              outputRange: [1, 0, 1],
              extrapolate: 'clamp'
            })

            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => this.onPress(index)}
                {...{ index }}
              >
                <Animated.View style={[styles.tab, { opacity }]}>
                  <Icon size={25} {...{ name }} />
                </Animated.View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  tab: {
    flex: 1,
    height: tabHeight,
    justifyContent: 'center',
    alignItems: 'center',
  }
})