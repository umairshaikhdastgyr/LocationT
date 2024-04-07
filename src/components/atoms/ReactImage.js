import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { icons } from '../../theme/Icons';
import { dimensions } from '../../theme/Dimensions';
import { buttonConfig, imageConfig } from '../../theme/Constants';
import PropTypes from 'prop-types';

const ReactImage = ({ disable, imageOnPress, imageStyle, uri, source, containerStyle }) => {
  return (
      <TouchableOpacity 
        disabled = {disable}
        activeOpacity = {buttonConfig.ACTIVE_OPACITY} 
        onPress = {() => imageOnPress()}
        style = {[containerStyle]} > 
        <Image
          source={uri ? {uri: uri} : source}
          style = {[styles.imageStyle, imageStyle]}  
          resizeMode={imageConfig.RESIZE_MODE}
        />
    </TouchableOpacity>
  );
};

ReactImage.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uri: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),  
  disable : PropTypes.bool,
  imageOnPress : PropTypes.func
};

ReactImage.defaultProps = {
  source : icons.dastgyrLogo, 
  disable : true,
  imageOnPress : () => null
};  

const styles = StyleSheet.create({ 
  imageStyle : {
    width: dimensions.WIDTH(5),
    height : dimensions.WIDTH(5)
  }
});

export default ReactImage;