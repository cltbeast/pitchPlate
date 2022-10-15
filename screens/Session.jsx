import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
//import {BleManager} from 'react-native-ble-plx'

//const _BleManager = new BleManager();


/**
 * Class for rendering the pitches to the screen.
 */
class RenderPitch extends React.Component {
    pitchColor = 'red';
    // pitch = [top, right]
    render(){
        this.pitchColor = 'red'
          return (
            <View>
                {this.props.pitches.map((prop,key)=>{
                  return (
                    <View 
                      key = {key}
                      style = {[{
                        backgroundColor: ((prop[0] <= -11 || prop[0] >= 195) || (prop[1] <= -5 || prop[1] >= 145)) 
                                    ? 'blue'
                                    :  'red',
                        height: 10,
                        width: 10, 
                        borderRadius: 50, 
                        position: 'absolute',
                        top: prop[0],
                        right: prop[1],
                        elevation: 10}
                      ]}>
                    </View>
                  );

                })}
            </View>
          )
    }
}


    
/**
 * Class that displays the screen for a pitching session
 */
class SessionScreen extends React.Component {
  /*
  startScan = () => {
    _BleManager.startDeviceScan(null, {
      allowDuplicates: false,
      },
      async (error, device) => {
        if (error) {
          _BleManager.stopDeviceScan();
        }
        Alert.alert("fine");
        console.log(device.localName, device.name);
        if (device.localName == 'Test' || device.name == 'Test') {
            setDevices([...devices, device]);
            _BleManager.stopDeviceScan();
        } 
      }, 
      )
  };

  connectDevice = device => {
        _BleManager.stopDeviceScan();
        _BleManager.connectToDevice(device.id).then(async device => {
          await device.discoverAllServicesAndCharacteristics();
            _BleManager.stopDeviceScan();
                setDisplayText(`Device connected\n with ${device.name}`);
                setConnectedDevice(device);
                setDevices([]);
            device.services().then(async service => {
                for (const ser of service) {
                    ser.characteristics().then(characteristic => {
                    getCharacteristics([...characteristics, characteristic]);
                    });
                }
          });
        });
    };
    */

    
  
  
  constructor(props) {
    super(props);    
    this.state = {
      post : null,
      strikes : 0,
      balls : 0,
      pitches : [],
      pitch : 0,
      strikeThrown : false,
      ballThrown : false,
      top : 0,
      right : 0,
    }
  }
  
  submitSession = async () => {
    
  }
  
  throwStrike = async () => {
      this.setState({strikes : this.state.strikes + 1});
      this.setState({pitch : this.state.pitch + 1});
      this.setState({strikeThrown:true});
      this.setState({ballThrown:false});
      this.state.pitches.push([-10,10])
      Alert.alert("You have thrown a strike");
  }
  
  throwBall = async () => {
      this.setState({balls : this.state.balls + 1});
      this.setState({pitch : this.state.pitch + 1});
      this.setState({strikeThrown:false})
      this.setState({ballThrown:true});
      this.state.pitches.push([25,-10])
      Alert.alert("You have thrown a ball");
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.pitchCount}>
        <Text>Pitch: {this.state.pitches}</Text>
        <Text>Strikes: {this.state.strikes}</Text>
        <Text>Balls: {this.state.balls}</Text>
        </View>
      <TouchableOpacity style={styles.SubmitBtn} onPress={this.startScan}>
          <Text style={styles.SubmitBtnText}>Start Session</Text>
      </TouchableOpacity>

      <View style={styles.InputWrapper}>
        <View style = {styles.ButtonContainer}>
          <TouchableOpacity style={styles.SubmitBtn} onPress={this.throwStrike}>
            <Text style={styles.SubmitBtnText}>Throw Strike</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.SubmitBtn} onPress={this.throwBall}>
            <Text style={styles.SubmitBtnText}>Throw Ball</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Zone}>
        <View style = {styles.strikeZone}></View>
       {this.state.strikeThrown && <RenderPitch  pitches={this.state.pitches}> </RenderPitch>}
       {this.state.ballThrown && <RenderPitch  pitches = {this.state.pitches}> </RenderPitch>}
      </View>
        <View style = {styles.submitButton}>
              <TouchableOpacity style={styles.SubmitBtn} onPress={() => this.props.navigation.navigate('Home')}>
                <Text style ={styles.SubmitBtnText}>End Session</Text>
              </TouchableOpacity>
        </View>
    </View>

  );
  }
};

export default SessionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  submitButton:{
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  pitchCount:{
    paddingTop:25,
    justifyContent:'center'
  },
  strikeZone:{
    width: 150,
    height: 200,
    marginTop:0,
    position: 'relative',
    top: 0,
    left: 0,
    backgroundColor: 'grey',
  },
  Zone:{
    marginBottom:100,
    height:200,
    width:150,
  },
  InputWrapper:{
    justifyContent : 'center',
    alignItems : 'center',
    flex:1,
    width:100,
    backgroundColor: 'white',
  },
  InputField:{
    justifyContent: 'center',
    alignItems: 'center',
    fontsize: 24,
    textAlign: 'center',
    width:50,
    marginBottom: 15,
  },
  StatusWrapper:{
    justifyContent:'center',
    alignItems:'center'
  },
  SubmitBtn:{
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'rgb(116, 143, 165)',
    borderRadius: 5,
    padding: 15,

  },
  SubmitBtnText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  }
});