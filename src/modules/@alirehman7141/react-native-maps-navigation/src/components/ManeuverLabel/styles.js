/**
 * @imports
 */
import { StyleSheet} from 'react-native';
import Fonts from '../../../../../../../fonts';
import { IconFont } from '../../constants/NavigationIcons';


/**
 * @styles
 */
export default props => StyleSheet.create({

    /**
     * @maneuverLabel
     */
    maneuverLabel: {
        flexDirection: 'row'
    },

    /**
     * @fonts
     */

    bold: {
        fontWeight: 'bold',
        fontFamily: props.fontFamilyBold || props.fontFamily,
        fontSize: props.fontSize,
        flexWrap: 'wrap',
        color: props.color
    },

    regular: {
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        flexWrap: 'wrap',
        color: props.color
    },

    extra: {
        fontFamily: Fonts.medium,

        fontSize: props.fontSize * 0.8,
        flexWrap: 'wrap',
        color: 'rgba(233,155,110,1)',
        marginTop: 4,
    },

    durationDistance: {
        fontFamily: props.fontFamily,
        fontSize: props.fontSize * 0.8,
        opacity: 0.8,
        flexWrap: 'wrap',
    },

});
