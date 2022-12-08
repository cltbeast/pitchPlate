import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { app, db } from '../firebase'
import { getAuth , createUserWithEmailAndPassword } from "@firebase/auth"
import { useNavigation } from '@react-navigation/core'
import {  doc, setDoc} from "firebase/firestore";
import { SelectList } from 'react-native-dropdown-select-list'



const auth = getAuth(app); 



const SignupScreen = ({}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [teamID, setTeamID] = useState("");

  const [password, setPassword] = useState(""); // was ()
  const [userType, setUserType] = useState("");
  
  const signUp = async () => {  
    await createUserWithEmailAndPassword(auth, email, password).then(async cred => {
        await setDoc(doc(db, "users", cred.user.uid), {
          username: username,
          email: email,
          type: userType,
        });
        navigation.navigate("Home");
      }).catch((error) => {
        console.log(error);
      });
  }
  const data = [
    {key:'1', value:'Individual'},
    {key:'2', value:'Coach'},
  ]


  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.text}>Create an account</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={username}
        onChangeText={(username) => setUsername(username)}
        placeholderText="Username"
        iconType="user"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={teamID}
        onChangeText={(teamID) => setTeamID(teamID)}
        placeholderText="Team Identification Number"
        iconType="user"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />


      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <View style = {styles.dropdown}>
      <SelectList 
        setSelected={(val) => setUserType(val)} 
        data={data} 
        save="value"
      />
      </View>
      <FormButton
        buttonTitle="Sign Up"
        disabled= {username == "" || email == "" || teamID == "" || password == "" || teamID == "" || userType == ""}
        onPress={() => signUp()}
      />

      <TouchableOpacity
        style = {styles.signinPage}
        onPress={() => navigation.navigate('Login')}>
          <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    padding: 20,
  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    //fontFamily: 'Lato-Regular',
    color: 'grey',
  },
  dropdown: {
    paddingTop : 15,
    paddingBottom: 15,
  },
  signinPage: {
    paddingTop:25
  }
});