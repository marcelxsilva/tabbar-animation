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
  values: Animated.Value[] = []
  constructor(props: Props) {
    super(props);
    const { tabs } = this.props;
    this.values = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0))
  }
  onPress = (index: number) => {
    const { value, tabs } = this.props;
    const tabWidth = width / tabs.length;
    Animated.sequence([
      ...this.values.map(value => Animated.timing(value, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      })),

      Animated.parallel([
        Animated.spring(this.values[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(value, {
          toValue: -width + tabWidth * index,
          useNativeDriver: true,
        })
      ]),
    ]).start()
  }

  render() {
    const { tabs, value } = this.props;
    const tabWidth = width / tabs.length;
    return (
      <View style={styles.container}>
        {
          tabs.map(({ name }, index) => {
            const activeValue = this.values[index];

            const opacity = value.interpolate({
              inputRange: [
                -width + tabWidth * (index - 1),
                -width + tabWidth * index,
                -width + tabWidth * (index + 1),
              ],
              outputRange: [1, 0, 1],
              extrapolate: 'clamp'
            });

            const translateY = activeValue.interpolate({
              inputRange: [0, 1],
              outputRange: [tabHeight, 0]
            })

            return (
              <React.Fragment key={index}>
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => this.onPress(index)}

                >
                  <Animated.View style={[styles.tab, { opacity }]}>
                    <Icon size={25} {...{ name }} />
                  </Animated.View>
                </TouchableWithoutFeedback>

                <Animated.View
                  style={{
                    position: 'absolute',
                    top: -8,
                    width: tabWidth,
                    left: tabWidth * index,
                    height: tabHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ translateY }]
                  }}>
                  <View style={styles.circle}>
                    <Icon size={25} {...{ name }} />
                  </View>
                </Animated.View>
              </React.Fragment>
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
  },
  circle: {
    width: 60,
    height: 60,
    marginTop: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
})