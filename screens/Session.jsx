import React from 'react';
import { getAuth } from '@firebase/auth';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { date } from './Home';
import { doc, setDoc, onSnapshot, updateDoc,query,collection,where,getDocs} from "firebase/firestore";
import { app, db } from '../firebase'


const latestPitchDocumentKey =  "3hCx34Um3uiyBSF0tvC8";

const auth = getAuth(app);


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
                        backgroundColor: ((prop[0] > -5 || prop[0] < -205) || (prop[1] > 145 || prop[1] < 0)) 
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
      devices : "",
      deviceConnected : false,
      latestPitchData : 1000,
    }
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


  throwPitch(yVal) {
    console.log("yvalue: " + yVal);
    let yValue = yVal;// this.state.latestPitchData; //Math.floor(Math.random() * (-10 + 200 + 1)) - 200;
    let xValue = Math.floor(Math.random() * (145 - 0 + 1)) + 0;
    this.state.pitches.push([yValue,xValue]);
    if (yValue > -5 || yValue < -205){
      this.setState({
        balls : this.state.balls + 1,
        pitch : this.state.pitch + 1,
        strikeThrown:false,
        ballThrown:true
      });
      this.writeBallToDB();
      console.log("Ball thrown");
    }
    else{
      this.setState({
          strikes : this.state.strikes + 1,
          pitch : this.state.pitch + 1,
          strikeThrown:true,
          ballThrown:false
      });
      console.log("Strike thrown");
      this.writeStrikeToDB();
    }
    
    
  }
  



  sessionEnded = async () => {
    const docRef = doc(db, "sessionId", "3hCx34Um3uiyBSF0tvC8");
    var sessions = 0;
    try {
      const ref = await updateDoc(docRef, {
        pitchData : 1000
      })
      const queryForSessions = query(collection(db, "users"), where ("email", "==", auth.currentUser?.email));
      const querySnapshot = await getDocs(queryForSessions);
      querySnapshot.forEach((doc)=> {
        sessions = doc.data().sessions;
      })
      const sessionRef =  doc(db, "users", auth.currentUser?.uid);
      const reff = await updateDoc(sessionRef, {
        sessions : sessions + 1
      });

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    this.props.navigation.navigate('Home');
  }

  getNewPitch(){
    let yValue = 0;
    const snapshot = onSnapshot(doc(db, "sessionId", latestPitchDocumentKey), (doc) => {
      if (doc.data()){
        yValue = doc.data().pitchData;
        console.log("data " + this.state.latestPitchData);
        this.state.latestPitchData != yValue ? this.throwPitch(Number(yValue)) : console.log("first render");
        this.setState({
          latestPitchData: doc.data().pitchData,
        });
      }
    });
  }
  

  componentDidMount(){
    this.getNewPitch();
  }

  


  render(){
    return (
      <View style={styles.container}>
        <View style={styles.pitchCount}>
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
    
     
      <View style={styles.Zone}>
        <View style = {styles.strikeZone}></View>
       {this.state.strikeThrown && <RenderPitch  pitches={this.state.pitches}> </RenderPitch>}
       {this.state.ballThrown && <RenderPitch  pitches = {this.state.pitches}> </RenderPitch>}
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
    backgroundColor : "#FF0000"
  }, 
  BallButton : {
    flexDirection:'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
    width : 150,
    backgroundColor : "#FF0000",
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