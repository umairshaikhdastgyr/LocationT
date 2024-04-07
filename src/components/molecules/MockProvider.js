import React, { useState } from 'react';
import { BackHandler, Text, View } from 'react-native';
import { checkLocationPermission } from '../../utils/Location';
import { environmentType, locationConfig, logsStatus } from '../../constants/Enums';
import { urls } from '../../constants/ApiConstant';
import { message } from '../../constants/Messages';
import { globalStyles } from '../../theme/GlobalStyle';
import { modalConfig } from '../../theme/Constants';
import Modal from 'react-native-modal';
import ReactButton from '../atoms/ReactButton';

export default MockProvider = React.forwardRef((props, ref) => {
  const [isVisible, ModalVisibility] = useState(false);

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      if (params != isVisible) {
        ModalVisibility(params)
      }
    }
  }));

  return (
    <Modal
      isVisible={urls.ENVIRONMENT === environmentType.PRODUCTION ? isVisible : false}
      animationIn={modalConfig.ANIMATION_SLIDE_IN} animationOut={modalConfig.ANIMATION_SLIDE_OUT}
      style={globalStyles.modalBottomView}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={globalStyles.modalMainView}>
        <Text style={globalStyles.modalTitle}>{message.fakeLocationDetected}</Text>
        <ReactButton
          title={message.ok}
          buttonOnPress={async () => {
            const location = await checkLocationPermission();
            if (!location || location == locationConfig.LOCATION_BLOCKED) {
              BackHandler.exitApp();
            }
          }}
        />
      </View>
    </Modal>
  );
});