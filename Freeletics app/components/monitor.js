import React, { Component } from 'react';

import { View,StyleSheet,Text,SafeAreaView } from 'react-native';
import moment from 'moment';
import { Svg } from 'expo';
import { Feather as Icon } from '@expo/vector-icons';


type MonitorProps={
    distante:number,
    pace:number
};



const radius = 100;
const strokeWidth = 20;



type MonitorState = {
    duration:number,

}

export default class Monitor extends Component <MonitorProps, MonitorState>{
    state={
        duration:0
    }


    componentDidMount(){
        this.interval = setInterval(()=>this.setState({duration:this.state.duration+1}),1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    formatDuration(duration:number){
        return moment.utc(moment.duration(duration,'s').asMilliseconds()).format("mm:ss");
    }

    render() {
    const {distance,pace} = this.props;
    const {duration} = this.state;
    return (
        <SafeAreaView style={styles.container}>
           
            <Text style={{fontSize:72,color:'white'}}>{distance}</Text>
            <View style={styles.row}>
                <View style={styles.rows}>
                    <Icon name="watch" color='white' size={28}/>
                    <Text style={styles.value}>{this.formatDuration(pace)}</Text>
                </View>

                <View style={styles.row}>
                    <Icon name="clock" color='white' size={28}/>
                    <Text style={styles.value}>{this.formatDuration(duration)}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        height:200,
        backgroundColor:'#29252b'
    },
    rows:{
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    row:{
        flexDirection:'row'
    },
    value:{
        marginLeft: 16,
        color: 'white',
        fontSize: 28,
    },
    progress:{

    }
});
