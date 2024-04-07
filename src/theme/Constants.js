import { colors } from "./Colors"
import { globalStyles } from "./GlobalStyle"

export const imageConfig = {
    RESIZE_MODE: 'contain'
}

export const modalConfig = {
    ANIMATION_IN: 'zoomInDown',
    ANIMATION_OUT: 'zoomOutUp',
    BACK_DROP_OPACITY: 0.7,
    ANIMATION_SLIDE_IN: 'slideInUp',
    ANIMATION_SLIDE_OUT: 'slideOutDown'
}

export const textConfig={
    CLIP:'clip'
}

export const buttonConfig = {
    ACTIVE_OPACITY: 0.8
}

export const textInputConfig = {
    NUMBER_PAD: 'number-pad',
    DESCRIPTION_LENGTH: 30
}

export const tabsConfig = {
    PRESS_COLOR: colors.transparent,
    screenOptions: {
        tabBarPressColor: colors.transparent,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.btn_gray,
        tabBarIndicatorStyle: globalStyles.backgroundPrimaryColor
    }
}

export const otpConfig = {
    DROPOFF_OTP_LENGTH: 5,
    PICKUP_OTP_LENGTH: 6
}

export const phoneConfig = {
    NUMBER_CODE: '+92',
    MOBILE_PLACEHOLDER: '3001234567',
    MOBILE_KEYBOARDTYPE: 'numeric',
    PASSWORD_PLACEHOLDER: '******',
    MAX_LENGTH: 10,
    MAX_LENGTH_UAE: 9,
    NUMBER_OF_LINES: 1,
    NUMBER_PAD: 'number-pad',
    ASCII_CAPABLE: 'ascii-capable',
    TEXT_MAX_LENGTH: 15,
    HELPLINE: '02137130255',
    WHATSAPP_HELPLINE: 'https://click2connect.tech/button/default/4657073192730624?customer_data=1709625456479&nscode=ZGFzdGd5ci5jYWxsY2VudGVyc3R1ZGlvLmNvbQ%3D%3D&cwid=ahRzfm11c3RlcmktaGl6bWV0bGVyaXIaCxINQ2xpY2syQ29ubmVjdBiAgOLK1fKiCAyiARxkYXN0Z3lyLmNhbGxjZW50ZXJzdHVkaW8uY29t'
}

export const passwordConfig = {
    MIN_LENGTH: 6,
}

export const calendarConfig = {
    PREVIOUS_TITLE: '<',
    NEXT_TITLE: '>',
    WEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

export const cameraConfig = {
    openCameraProperties: {
        width: 600,
        height: 600,
        compressImageMaxHeight: 600,
        compressImageMaxWidth: 600,
        includeBase64: true,
        freeStyleCropEnabled: true,
        hideBottomControls: true,
        includeExif: true,
        compressImageQuality: 1
    },
    openPickerProperties: {
        width: 600,
        height: 600
    }
}

export const mapConfig = {
    TYPE: {
        STANDARD: 'standard',
        SATELLITE: 'satellite'
    }
}