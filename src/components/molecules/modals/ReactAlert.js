import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { dimensions } from '../../../theme/Dimensions';
import { globalStyles } from '../../../theme/GlobalStyle';
import { modalConfig } from '../../../theme/Constants';
import { message } from '../../../constants/Messages';
import { icons } from '../../../theme/Icons';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import ReactButton from '../../atoms/ReactButton';
import ReactImage from '../../atoms/ReactImage';

let propsData = {};
export const ReactAlert = React.forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState (false);
    const [disabled, setDisabled] = useState(false);
    const {
        title, 
        btnText, 
        icon, 
        showPopup, 
        buttonOnPress, 
        imageStyle
    } = propsData;

    React.useImperativeHandle(ref, () => ({
        isVisible(params) {
            propsData = params;
            setIsVisible(true);
            setDisabled(false);
        },
        isClose() {
            setIsVisible(false);
        },
    }));
    return (
        <Modal isVisible={isVisible}
            animationIn={modalConfig.ANIMATION_SLIDE_IN} animationOut={modalConfig.ANIMATION_SLIDE_OUT}
            style={globalStyles.modalBottomView}
            onBackButtonPress={() => showPopup()}
            onBackdropPress={() => showPopup()}
        >
            <View style={globalStyles.modalMainView}>
                <ReactImage source={icon} containerStyle={styles.imageStyle} imageStyle={[imageStyle]} />
                <Text style={[globalStyles.modalTitle, { paddingTop: dimensions.WIDTH(5), paddingBottom: dimensions.WIDTH(0) }]}>{title}</Text>
                { btnText && <ReactButton title={btnText} buttonStyle={styles.btnView} buttonOnPress={() => buttonOnPress()} /> }
            </View>
        </Modal>
    )
});

ReactAlert.propTypes = {
    title : PropTypes.string,
    icon: PropTypes.number,
    showPopup: PropTypes.func,
    buttonOnPress: PropTypes.func
};

ReactAlert.defaultProps = {
    title : message.callHelpline,
    icon: icons.confirmed,
    showPopup: () => null,
    buttonOnPress: () => null
};

const styles = StyleSheet.create({
    btnView: {
        marginTop: dimensions.WIDTH(5)
    },
    imageStyle: {
        alignItems: 'center'
    }
});