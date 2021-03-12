import React from 'react';
import { StyleSheet,ActivityIndicator, View ,StatusBar} from 'react-native';
import {Location,Permissions} from 'expo';


import Run from './components/run';

type appState = {
  ready:boolean,
  latitude:number,
  longitude:number
}
export default class App extends React.Component {
  state={
    ready:false,
    latitude:null,
    longitude:null
  }

  async componentDidMount(){
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status === 'granted'){
      const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync();
      this.setState({ready:true,latitude,longitude})
      
    }else{
      alert('Could´t get your location')
    }
   
  }
  render() {
    const {ready,latitude,longitude} = this.state;
    return (
      <React.Fragment>
        <StatusBar barStyle='light-content' />
        {
          ready && (
            <Run distance={200} {...{latitude,longitude}}/>
          )
        }
        {
          !ready && (
            <View style='style.container'>
              <ActivityIndicator size='large' color='white'/>
            </View>
          )
        }

      </React.Fragment>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#29252b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
