import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/Colors';
import { dimensions } from '../../theme/Dimensions';
import { globalStyles } from '../../theme/GlobalStyle';
import { message } from '../../constants/Messages';
import ReactButton from '../atoms/ReactButton';
import PropTypes from 'prop-types';

const MultipleButtons = ({ containerStyle, firstBtnTitle, secondBtnTitle, firstBtnStyle, firstBtnTextStyle, secondBtnStyle, secondBtnTextStyle, firstBtnOnPress, secondBtnOnPress, secondBtnDisable }) => {
    return (
        <View style={[styles.containerStyle, containerStyle]}>
            <ReactButton title={firstBtnTitle} buttonStyle={[styles.firstBtnStyle, firstBtnStyle]} textStyle={[globalStyles.textPrimaryColor, firstBtnTextStyle]} buttonOnPress={() => firstBtnOnPress()} />
            <ReactButton title={secondBtnTitle} buttonStyle={[styles.secondBtnStyle, secondBtnStyle]} textStyle={[secondBtnTextStyle]} buttonOnPress={() => secondBtnOnPress()} disable={secondBtnDisable} />
        </View>
  );
};

MultipleButtons.propTypes = {
    firstBtnTitle : PropTypes.string,
    secondBtnTitle : PropTypes.string,
    firstBtnOnPress : PropTypes.func,
    secondBtnOnPress : PropTypes.func
};
  
MultipleButtons.defaultProps = {
    firstBtnTitle : message.cancel,
    secondBtnTitle : message.confirm,
    firstBtnOnPress : () => null,
    secondBtnOnPress : () => null
};

const styles = StyleSheet.create({
    containerStyle : {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    firstBtnStyle : {
        width: dimensions.WIDTH(42), 
        backgroundColor: colors.white, 
        borderColor: colors.orange, 
        borderWidth: 1.5
    },
    secondBtnStyle : {
        width: dimensions.WIDTH(42)
    }
  });

export default MultipleButtons;