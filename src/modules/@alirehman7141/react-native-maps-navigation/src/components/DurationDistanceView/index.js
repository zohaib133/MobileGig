/**
 * @imports
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import Styles from './styles';
import CloseButton from "../CloseButton";
import DurationDistanceLabel from "../DurationDistanceLabel";
import DistanceCard from './items/DistanceCard';


/**
 * @component
 */
export default class ManeuverView extends Component {

    /**
     * propTypes
     * @type {}
     */
    static propTypes = {
        step: PropTypes.any.isRequired,
        fontFamily: PropTypes.string,
        fontFamilyBold: PropTypes.string,
        fontSize: PropTypes.number,
        arrowSize: PropTypes.number,
        arrowColor: PropTypes.string,
        withCloseButton: PropTypes.bool,
        onClose: PropTypes.func,
        onPress: PropTypes.func,
    }

    /**
     * defaultProps
     * @type {}
     */
    static defaultProps = {
        step: undefined,
        fontFamily: undefined,
        fontFamilyBold: undefined,
        fontSize: 20,
        arrowSize: 50,
        arrowColor: '#545455',
        withCloseButton: false,
        onClose: undefined,
        onPress: undefined,
    }


    /**
     * @constructor
     * @param props
     */
    constructor(props)
    {
        super(props);

    }


    /**
     * render
     * @returns {XML}
     */
    render()
    {
        const styles = Styles(this.props);

        const step = this.props.step;

        if(!step) return null;

        return (
            // <TouchableOpacity style={styles.durationDistanceView}>
            //     <View style={styles.durationDistanceContent}>

            //         <Text>
            //             {step.distance ? step.distance.text : ''}
            //         </Text>

            //         <Text>
            //             {step.duration ? step.duration.text : ''}
            //         </Text>

            //     </View>
            //     {!this.props.withCloseButton ? null : (
            //         <View style={styles.durationDistanceClose}>
            //             <CloseButton onPress={() => this.props.onClose && this.props.onClose()} />
            //         </View>
            //     )}
            // </TouchableOpacity>
            <DistanceCard
            distance={{
                text1:step.distance.text.split(" ")[0],
                text2:step.distance.text.split(" ")[1]
            }}
            time={{
                text1:step.duration.text.split(" ")[0],
                text2:step.duration.text.split(" ")[1]
            }}
            onClosePress={this.props.onClose}
            />
        );
    }
}

