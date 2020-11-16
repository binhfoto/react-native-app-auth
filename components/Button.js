import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Button = ({ image, text, textColor, color, style, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.buttonBox, { backgroundColor: color }, style && style]}
  >
    {image && <Image source={image} />}
    <Text style={[styles.text, textColor && styles.textColor]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16
  },
  textColor: {
    color: 'green',
    fontSize: 22,
    fontWeight: '600'
  },
  buttonBox:{
    height: 50,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // width: '95%',
    // flex: 1,
  }
});

export default Button;
