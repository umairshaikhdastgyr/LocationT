import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { modalConfig } from '../../../theme/Constants';
import { globalStyles } from '../../../theme/GlobalStyle';
import { message } from '../../../constants/Messages';
import MultipleButtons from '../MultipleButtons';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import ReactButton from '../../atoms/ReactButton';

let propsData = {};
export const ConfirmationAlert = React.forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState (false);
    const [disabled, setDisabled] = useState(false);
    const {
        title,
        cancelButton,
        confirmButton,
        cancelButtonOnpress,
        confirmButtonOnpress,
        onBackdropPress,
        firstBtnStyle,
        secondBtnStyle
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
        <Modal 
            isVisible={isVisible}
            animationIn={modalConfig.ANIMATION_SLIDE_IN} animationOut={modalConfig.ANIMATION_SLIDE_OUT}
            style={globalStyles.modalBottomView}
            onBackButtonPress={() => onBackdropPress()}
            onBackdropPress={() => onBackdropPress()}
        >
            <View style={globalStyles.modalMainView}>
                <Text style={globalStyles.modalTitle}>{title}</Text>

                {
                    cancelButton ?
                    <MultipleButtons
                        firstBtnTitle={cancelButton}
                        secondBtnTitle={confirmButton}
                        firstBtnOnPress={() => cancelButtonOnpress()}
                        secondBtnOnPress={() => confirmButtonOnpress()}
                        firstBtnStyle={firstBtnStyle}
                        secondBtnStyle={secondBtnStyle}
                    /> :
                    <ReactButton
                        title={confirmButton}
                        buttonOnPress={() => confirmButtonOnpress()}
                    />
                }

            </View>
        </Modal>
    )
});

ConfirmationAlert.propTypes = {
    title : PropTypes.string,
    cancelButtonOnpress: PropTypes.func,
    confirmButtonOnpress: PropTypes.func,
    onBackdropPress: PropTypes.func
};
  
ConfirmationAlert.defaultProps = {
    title : message.askConfirmation,
    cancelButtonOnpress: () => null,
    confirmButtonOnpress: () => null,
    onBackdropPress: () => null
};