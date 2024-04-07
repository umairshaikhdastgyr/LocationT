import { StyleSheet } from 'react-native';
import { colors } from './Colors';
import { dimensions } from './Dimensions';

export const globalStyles = StyleSheet.create({
    mainContainer : {
        flex: 1,
        backgroundColor : colors.white
    },
    buttonContainer: {
        marginHorizontal: dimensions.WIDTH(5), 
        marginBottom: dimensions.WIDTH(5)
    },
    contentContainer: {
        flex: 1,
        padding: dimensions.WIDTH(5)
    },
    firstView: {
        padding: dimensions.WIDTH(5)
    },
    textPrimaryColor: {
        color: colors.orange
    },
    backgroundPrimaryColor: {
        backgroundColor: colors.orange
    },
    paymentHeading: {
        paddingBottom : dimensions.WIDTH(2),
        fontWeight : '600',
        fontSize : dimensions.WIDTH(4.7),
        color : colors.black
    },
    modalBottomView: {
        margin: 0, 
        bottom: 0, 
        position: 'absolute', 
        width: '100%'
    },
    modalMainView: {
        padding: dimensions.WIDTH(5), 
        backgroundColor: colors.white, 
        borderTopRightRadius: dimensions.WIDTH(5), 
        borderTopLeftRadius: dimensions.WIDTH(5)        
    },
    modalTitle: {
        fontSize: dimensions.WIDTH(4.5), 
        fontWeight: '500', 
        color: colors.black, 
        textAlign: 'center', 
        paddingBottom: dimensions.WIDTH(5)
    },
    radioBtnView: {
        borderWidth: 1, 
        width: dimensions.WIDTH(6), 
        height: dimensions.WIDTH(6), 
        borderRadius: dimensions.WIDTH(10), 
        justifyContent: 'center', 
        alignItems: 'center',
        borderColor: colors.light_grayish_blue
    },
    radioBtn: {
        borderWidth: 1, 
        width: dimensions.WIDTH(4.5), 
        height: dimensions.WIDTH(4.5), 
        borderRadius: dimensions.WIDTH(10), 
        backgroundColor: colors.orange,
        borderColor: colors.light_grayish_blue
    },
    inputTitle: {
        color : colors.black,
        fontWeight : '600',
        paddingBottom: dimensions.WIDTH(3)
    },
    confirmIcon: {
        width: dimensions.WIDTH(10), 
        height: dimensions.WIDTH(10)
    },
    paymentView: {
        marginVertical: dimensions.WIDTH(5)
    },
    inputAmountView: {
        paddingLeft: dimensions.WIDTH(3.5), 
        padding: dimensions.WIDTH(0), 
        marginBottom: dimensions.WIDTH(8)
    },
    reasonHeading: {
        color: colors.black, 
        paddingBottom: dimensions.WIDTH(5), 
        fontSize: dimensions.WIDTH(4.4), 
        fontWeight: '500'
    },
    reasonView: {
        flexDirection: 'row', 
        paddingBottom: dimensions.WIDTH(7)
    },
    reasonDescription: {
        paddingHorizontal: dimensions.WIDTH(5), 
        fontSize: dimensions.WIDTH(4.3), 
        flex: 1,
        color: colors.black
    }
});