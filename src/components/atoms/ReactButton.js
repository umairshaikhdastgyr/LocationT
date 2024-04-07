import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/Colors';
import { message } from '../../constants/Messages';
import { dimensions } from '../../theme/Dimensions';
import { buttonConfig } from '../../theme/Constants';
import PropTypes from 'prop-types';

const ReactButton = ({ title, disable, buttonOnPress, buttonStyle, textStyle }) => {
  const lastTap = useRef(0);
  const handlePress = () => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 1500;
    if ((now - lastTap.current) > DOUBLE_PRESS_DELAY && buttonOnPress) {
      buttonOnPress();
      lastTap.current = now;
    }
  };

  return (
    <TouchableOpacity 
      disabled = {disable}
      activeOpacity = {buttonConfig.ACTIVE_OPACITY} 
      onPress = {() => handlePress()}
      style = {[styles.button, buttonStyle]} > 
      <Text style = {[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

ReactButton.propTypes = {
  title : PropTypes.string,
  disabled : PropTypes.bool,
  buttonOnPress : PropTypes.func,
};

ReactButton.defaultProps = {
  title : message.defaultButtonText,
  disabled : true,
  buttonOnPress : () => null,
};

const styles = StyleSheet.create({
  button : {
    alignItems : 'center',
    backgroundColor : colors.orange,
    padding : dimensions.WIDTH(3),
    borderRadius : dimensions.WIDTH(2),
  },
  text : {
    color : colors.white,
    fontWeight : '600',
    fontSize : dimensions.WIDTH(4.7)
  }
});

export default ReactButton;