import React from 'react'
import { View , StyleSheet} from 'react-native'
import {MapView,Location} from 'expo'
import * as turf from '@turf/turf';
import * as _ from 'lodash';
import moment from 'moment';


const {Marker,Polyline} = MapView;

import Monitor from './monitor';
import Pin from './pin'

type Position = {
    timestamp:number,
    coords:{
        latitude:number,
        longitude:number,
        accuracy:number
    }
}
type RunProps = {
    distance:number,
    latitude:number,
    longitude:number
}

type RunState = {
    positions:Position[],
    distance:number,
    pace:number
}
export default class Run extends React.Component<RunProps,RunState>{
    map = React.createRef();

    state={
        positions:[],
        distance:0,
        pace:0
    };

    async componentDidMount(){
        const options =  {
            enableHighAccuracy:true,
            timeInterval:1000,
            distanceInterval :1
        }
        this.listener = await Location.watchPositionAsync(options,this.onPositionChange.bind(this));
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    computePace(delta:number,previusPosition:Position,position:Position){
        const time = position.timestamp - previusPosition.timestamp;
        const pace = time / delta;
        return pace;

    }

    onPositionChange(position:Position){
        this.map.current.animateToCoordinate(position.coords,1000);
        
        const {latitude,longitude} = this.props;
        const lastPosition = this.state.positions.length === 0 ? 
        {coords:{latitude,longitude},timestamp:position.timestamp}:this.state.positions[this.state.positions.length -1];
        const delta = this.distanceBetween(lastPosition,position);
        const distance = this.state.distance + delta;
        const pace = this.computePace(delta,lastPosition,position);

        this.setState(
            {
                positions:[...this.state.positions,position],
                distance,
                pace
            }
        );
    }

    distanceBetween(origin:Position,destination:Position){
        const from = turf.point([origin.coords.longitude,origin.coords.latitude]);
        const to = turf.point([destination.coords.longitude,destination.coords.latitude]);
        const options = {units:'meters'}
        
        return _.round(turf.distance(from,to,options));
    }

    render():React.Node{
        const {positions, distance,pace} = this.state;
        const {latitude, longitude} = this.props;
        const currentPosition = positions.length === 0 ? {coords:{latitude,longitude}}:positions[positions.length-1];
    
        return (
            <View style={styles.container}>
                <Monitor {...{distance,pace}}/>
                <MapView provider='google'
                ref={this.map}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta:0.01,
                    longitudeDelta:0.01
                }}
                style={styles.map}>

                    <Marker coordinate={currentPosition.coords}>
                        <Pin/>
                    </Marker>
                    <Polyline 
                        coordinates={positions.map(position => position.coords)}
                        strokeColor='#f2b659'
                    /> 
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    map:{
        flex:1
    }
});

 