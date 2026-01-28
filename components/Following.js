import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Navbar from './Navbar';

function Following({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Following</Text>
      <Navbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
    backgroundColor: 'yellow',
  },
});

export default Following;
