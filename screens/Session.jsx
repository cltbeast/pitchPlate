import React, {useState, useContext} from 'react';
import { getAuth } from '@firebase/auth';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import {BleManager} from 'react-native-ble-plx'
import { date } from './Home';
import { doc, setDoc} from "firebase/firestore";
import { app, db } from '../firebase'

const _BleManager = new BleManager();


/**
 * Class for rendering the pitches to the screen.
 */


class RenderPitch extends React.Component {
    pitchColor = 'red';
    render(){
        this.pitchColor = 'red'
          return (
            <View>
                {this.props.pitches.map((prop,key)=>{
                  return (
                    <View 
                      key = {key}
                      style = {[{
                        backgroundColor: ((prop[0] > -10 || prop[0] < -200) || (prop[1] > 145 || prop[1] < 0)) 
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
  auth = getAuth(app);
  
  

    

  
  
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
      connectingBluetooth : false,
      devices : "",
      deviceConnected : false,
    }
  }
  
  throwStrike = async () => {
      this.setState({strikes : this.state.strikes + 1});
      this.setState({pitch : this.state.pitch + 1});
      this.setState({strikeThrown:true});
      this.setState({ballThrown:false});
      let yValue = Math.floor(Math.random() * (-10 + 200 + 1)) - 200;
      let xValue = Math.floor(Math.random() * (145 - 0 + 1)) + 0;
      this.state.pitches.push([yValue,xValue]);
      this.setState({connectingBluetooth:false});
      console.log("strike thrown");
      this.writeStrikeToDB();
      
  }
  writeStrikeToDB = () => {
    const docRef = doc(db, "sessions", date);
        setDoc(docRef, {
          pitches: this.state.pitch + 1,
          strikes: this.state.strikes + 1,
          balls: this.state.balls,
          user: this.auth.currentUser?.uid,
          creationDate: date
        });
      Alert.alert("You have thrown a strike");
  }
  writeBallToDB = () => {
    const docRef = doc(db, "sessions", date);
        setDoc(docRef, {
          pitches: this.state.pitch + 1,
          strikes: this.state.strikes,
          balls: this.state.balls + 1,
          user: this.auth.currentUser?.uid,
          creationDate : date
        });
  }
  
  throwBall = async () => {
      this.setState({balls : this.state.balls + 1});
      this.setState({pitch : this.state.pitch + 1});
      this.setState({strikeThrown:false});
      this.setState({ballThrown:true});
      //Math.floor(Math.random() * (max - min + 1)) + min;
      let yValue = Math.floor(Math.random() * (-11 + 50 + 1)) - 50;
      let xValue = Math.floor(Math.random() * (170 - 146 + 1)) + 146;
      this.state.pitches.push([yValue,xValue]);
      this.writeBallToDB();
      this.setState({connectingBluetooth:false});
      Alert.alert("You have thrown a ball");
  }
  // startScan = () => {
  //  this.setState({connectingBluetooth: true});
  // }

  sessionEnded = () =>{
    this.props.navigation.navigate('Home');
  }
  
  
  startScan = async() => {
    this.setState({deviceConnected : true});
    // console.log("scanning");
    // this.setState({connectingBluetooth: true});
    // _BleManager.startDeviceScan(null, {
    //   allowDuplicates: false,
    //   },
    //   async (error, device) => {
    //     if (error) {
    //       _BleManager.stopDeviceScan();
    //     }
    //     console.log("local name" + device.localName);
    //     if (device.localName == 'DSD TECH') {
    //         Alert.alert("Plate found");
    //         console.log("devices: " + device.id)
    //         _BleManager.stopDeviceScan();
    //         device.connect().then(async (device)=> {
    //           Alert.alert("Plate connected!");
    //           console.log("here");
    //           this.setState({deviceConnected : true});
    //           console.log(await _BleManager.readCharacteristicForDevice(device.id, "0000ffe0-0000-1000-8000-00805f9b34fb", "0000FFE1-0000-1000-8000-00805F9B34FB"));
    //           //console.log(await _BleManager.characteristicsForDevice(device.id, "0000FFE0-0000-1000-8000-00805F9B34FB"));
    //           //this.getCharacteristics(device);
    //           console.log("device id: " + device.id);
    //           this.setState({device: device.id});
    //         });
    //     } 
    //   }, 
    //   )
  };
  getCharacteristics = async device => {
    console.log(await _BleManager.discoverAllServicesAndCharacteristicsForDevice(device.id));
  }

  


  render(){
    return (
      <View style={styles.container}>
        <View style={styles.pitchCount}>
        {this.state.connectingBluetooth && <ActivityIndicator style={{paddingBottom:15}}size="large" color="#A7C7E7" />}
          <Text style = {styles.pitchCountText}>Session Start Time: {date} {this.state.pitches}</Text>
          <Text style = {styles.pitchCountText}>Pitches: {this.state.pitch}</Text>
          <Text style = {styles.pitchCountText}>Strikes: {this.state.strikes}</Text>
          <Text style = {styles.pitchCountText}>Balls: {this.state.balls}</Text>
        </View>
      <TouchableOpacity style={styles.connectButton} onPress={this.startScan}>
          <Text style={styles.SubmitBtnText}>Scan for Plate</Text>
      </TouchableOpacity>

      <View style = {styles.statusButton}>
      {this.state.deviceConnected && <TouchableOpacity style={styles.connectedButton} onPress={this.startScan}>
          <Text style={styles.SubmitBtnText}>Plate Connected</Text>
      </TouchableOpacity>}
      {!this.state.deviceConnected && <TouchableOpacity style={styles.disconnectedButton} onPress={this.startScan}>
          <Text style={styles.SubmitBtnText}>Plate Not Connected</Text>
      </TouchableOpacity>}
      </View>
      
        <View style = {styles.ButtonContainer}>
          {this.state.pitch < 10 && 
          <TouchableOpacity style={styles.StrikeButton} onPress={this.throwStrike}>
            <Text style={styles.SubmitBtnText}></Text>
          </TouchableOpacity>}
          {this.state.pitch < 10 &&
          <TouchableOpacity style={styles.BallButton} onPress={this.throwBall}>
            <Text style={styles.SubmitBtnText}></Text>
          </TouchableOpacity>}
        </View>
     
      <View style={styles.Zone}>
        <View style = {styles.strikeZone}></View>
       {this.state.strikeThrown && <RenderPitch  pitches={this.state.pitches}> </RenderPitch>}
       {this.state.ballThrown && <RenderPitch  pitches = {this.state.pitches}> </RenderPitch>}
       {/* <View style = {styles.batterImage}>
        <Image
          source={require('../assets/batterPicture.png')}
          style={styles.batterImage}
        />
       </View> */}
      </View>
        <View style = {styles.submitButton}>
              <TouchableOpacity style={styles.SubmitBtn} onPress={this.sessionEnded}>
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
    //justifyContent: 'center',
    backgroundColor : "#cecece"
  },
  batterImageView: {
    //justifyContent: 'flex-end',
    paddingLeft: 100,
    //flexDirection: 'row'
  },
  batterImage: {
    paddingLeft:150
  },
  homePlateImage: {
    width : 150,
    height: 155,
    paddingBottom: 15
  },
  pitchCountText: {
    textAlign:'center'
  },
  ButtonContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 15,
      paddingBottom : 15
  },
  submitButton:{
    paddingTop: 15
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  pitchCount:{
    paddingTop:0,
    justifyContent:'center',
    paddingBottom: 25
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
    marginBottom:25,
    paddingTop: 25,
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
    width : 150,
  },
  StrikeButton: {
    flexDirection:'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
    width : 150,
    backgroundColor : "#cecece"
  }, 
  BallButton : {
    flexDirection:'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
    width : 150,
    backgroundColor : "#cecece",
  },
  connectButton: {
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'rgb(116, 143, 165)',
    borderRadius: 5,
    padding: 10,
  },
  SubmitBtnText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  connectedButton: {
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'rgb(34,139,34)',
    borderRadius: 5,
    padding: 15,
  },
  disconnectedButton: {
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'rgb(139,0,0)',
    borderRadius: 5,
    padding: 10,
    paddingTop:10
  },
  statusButton: {
    paddingTop: 15
  }

});