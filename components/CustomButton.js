import React from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

function CustomButton({label, iconName}) {
  return (
    <TouchableHighlight style={styles.button}>
      <View>
        <Icon name={iconName} size={30} color="black" style={styles.icon} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'flex-start',
  },
  icon: {
    alignSelf: 'center',
    color: '#545454',
  },
  text: {
    color: '#545454',
  },
});

export default CustomButton;
