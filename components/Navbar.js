import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import CustomButton from './CustomButton';

function Navbar() {
  return (
    <View style={styles.navbar}>
      <CustomButton label={'Home'} iconName={'home'} />
      <CustomButton label={'Leaderboards'} iconName={'menu'} />
      <CustomButton label={'Activity'} iconName={'stopwatch'} />
      <CustomButton label={'Bookmarks'} iconName={'book'} />
      <CustomButton
        label={'Profile'}
        iconName={'user'}
        destination={'Profile'}
      />
    </View>
  );
}

{
  /* <NavigationContainer>
<Stack.Navigator>
  <Stack.Screen name="Following" component={Following}/>
  <Stack.Screen name="Profile" component={Profile}/>
</Stack.Navigator>
</NavigationContainer> */
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#081c2c',
    justifyContent: 'space-evenly',
    padding: 15,
    height: '10%',
    width: '100%',
    fontSize: '1',
  },
});
export default Navbar;
