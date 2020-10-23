import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Button = ({ image, text, color, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.buttonBox, { backgroundColor: color }]}
  >
    {image && <Image source={image} />}
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16
  },
  buttonBox: {
    height: 50,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%'
  }
});

export default Button;
