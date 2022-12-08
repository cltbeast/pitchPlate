import { getAuth, signOut } from '@firebase/auth'
import React  from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { app, db } from '../firebase'
import { doc, setDoc, getDocs, collection, getDoc, query, where} from "firebase/firestore";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

const auth = getAuth(app);



export var date = "";
const getDate = () => {
  date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds
  date = date + '-' + month + '-' + year + ' ' + hours + ':' + min + ':' + sec
}

class HomeScreen extends React.Component{
  auth = getAuth(app);
  constructor(props){
    super(props);
    this.state = {
      sessions: [],
      userType : "",
      sessionArray: [],
    }
  }

  
  tableHeaders = ['Creation Date', 'Strikes', 'Balls', 'Pitches'];
  tableHeadersCoach = ['Player Email', 'Player Pitching Sessions'];
  playerArray = [[
       'pitcher@gmail.com', 1
  ]]

  handleSignOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.navigate("Login")
    }).catch((error) => {
    });
    this.setState({sessions: []})
  }
  createSession = async () =>{
    getDate();
    const docRef = doc(db, "sessions", date);
      setDoc(docRef, {
        user: auth.currentUser?.uid,
        pitches: 0,
        strikes: 0,
        balls: 0, 
        creationDate: date
    });
    this.setState({sessions: []})
  }
  
  getSessions = async () => {
    this.setState({sessions: []})
    this.setState({sessionArray: []});
    var localSessions = [];
    const queryForSessions = query(collection(db, "sessions"), where ("user", "==", auth.currentUser?.uid));
    const querySnapshot = await getDocs(queryForSessions);
    querySnapshot.forEach((doc)=> {
      this.setState({ sessions: [...this.state.sessions, doc.data()]})})
    var answer=this.state.sessions.map(function(el){
      var arr=[0,0,0,0];
      for(var key in el){
        if (key === "creationDate"){
          arr[0] = el[key];
        }
        else if (key === "strikes"){
          arr[1] = el[key];
        }
        else if (key === "balls"){
          arr[2] = el[key];
        }
        else if (key === "pitches"){
          arr[3] = el[key];
        }
      }
      localSessions.push(arr)
      });
      this.setState({sessionArray : [...this.state.sessionArray, localSessions]});
    
    console.log(this.state.sessionArray);
  }
  componentDidMount = async () => {
      this.getSessions();
  }


  render(){
    return (
    <ScrollView style= {styles.container}>
    <View style={styles.container}>
      <View style = {styles.user}>
        <View style={styles.user}>
          <Text style = {{paddingTop:30, paddingLeft:15, fontWeight : "bold"}}> {auth.currentUser?.email}</Text>
          <Text style = {{paddingTop : 20, paddingLeft : 15,  fontWeight : "bold"}}> Account type: Coach </Text>
        </View>
        <View style={styles.tableContainer}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#000000'}}>
            <Row data={this.tableHeadersCoach} style={styles.HeadStyle} textStyle={styles.TableText}/>
            {/* <Rows data={this.state.sessionArray[0]} textStyle={styles.TableText}/> */}
            <Rows data={this.playerArray} textStyle={styles.TableText}/>
          </Table>
        </View>
        <View style = {styles.userInfo}>
        {/* <TouchableOpacity
          onPress={() => this.createSession().then(this.props.navigation.navigate('Session'))}
          style={styles.button}
          >
          <Text style={styles.buttonText}> Start Session</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={this.handleSignOut}
          style={styles.buttonSignOut}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.getSessions}
          style={styles.refreshButton}
        >
        <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
        
      </View>
      </View>
    </View>
    </ScrollView>
  )
  }
  
}

export default HomeScreen

const styles = StyleSheet.create({
  tableContainer: { 
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: '#808080' 
  },
  HeadStyle: { 
    height: 50,
    alignContent: "center",
    backgroundColor: '#808080'
  },
  TableText: { 
    margin: 5,
    textAlign: 'center' 
  },

  container: {
    backgroundColor : "#cecece",
    width: "100%",
    height: "100%"
  },
  strikeText: {
    color: "red"
  },
  ballText: {
    color: "blue"
  },
  user:{
    textAlign : "left"
  },
  tableRow: {
    flexDirection:"row",
    paddingTop : 15,
    alignItems:'center',
  },
   button: {
    backgroundColor: '#0782F9',
    //backgroundColor: '#808080',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonSignOut: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  refreshButton: {
    backgroundColor: '#cecece',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  tableContainer: {
    padding: 15,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC'
  },
  userInfo:{
    justifyContent:'center',
    alignItems:'center'
  },
  gridContainer: {
      width: 220,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  cellStyle: {
    flex: 1,
    margin: 10,
  },
})