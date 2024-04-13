import { View,Text,Image,ImageBackground,TextInput,ScrollView,TouchableOpacity,FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import {loadFonts,styles} from "./mainMess.style";
import Expo from 'expo'
import {name as appName} from "../../../app.json"
import { AppRegistry } from "react-native";
import { registerRootComponent } from 'expo';
import { icons } from "@constants";
// import SvgUri from 'react-native-svg-uri';
import CardMessage from "./card_message";
import { render } from "react-dom";
import { useFonts } from 'expo-font';
import { Message } from "../chat_room/message";
import axios from 'axios';






const ScreenMess = () => {
	const [isFontLoaded, setFontLoaded] = useState(false);
	const [chatRooms,setChatRooms]=useState([]);
	const [myid,setMyid]=useState('');
	const [accessToken,setAccessToken]=useState('');
	const loadChat=  async ()=>{
		const response = await axios.get('https://se346-skillexchangebe.onrender.com/api/v1/chat/find/'+myid, {
		  method: 'GET',
		  headers: {
			'Content-Type': 'application/json',
			// Authorization: `Bearer ${accessToken}`,
		  },});
		  if(response.status == 400){
			alert('Something went wrong');
		  }
		  else
		  {
			const json=response.json();
			setChatRooms(json.data);
		  }
	}
  useEffect(() => {
    const loadFont = async () => {
      await loadFonts();
      setFontLoaded(true);
    };
    loadFont();
	loadChat();

  }, []);

  if (!isFontLoaded) {
    return null; // Return null or a loading indicator while the font is loading
  }
 

  const handleChat=(idChat)=>{
	
  }

  const renderItem = ({ item }) => (
	<TouchableOpacity onPress={handleChat( item.chatInfo._id)}>
		<Message    Name={item.chatInfo.member[1].username} 
				Recent={item.latestMessage.text} 
				Avartar={item.chatInfo.member[1].Avartar}
				Status="online"
				Time="30m" />
	</TouchableOpacity>
    
  );


	return (
	  <View style={styles.Horizon} > 
		<View style={styles.Container}>
			<Text style={styles.Header}>Message</Text>
			<View style={styles.Search}>
			<Image source={icons.search_icon} style={styles.IconSearch}></Image>
			<TextInput placeholder="Tìm kiếm" style={styles.Input}></TextInput>
			</View>
		</View>
		
			
		<View style={styles.Scroll} >
			{/* <ScrollView >
			        <CardMessage Name="Rem" Recent="I love you" Status="online" Time="15m"></CardMessage>
					<CardMessage Name="Rem" Recent="I love you too" Status="offline" Time="30m"></CardMessage>
					<CardMessage Name="Rem" Recent="I love you too" Status="offline" Time="30m"></CardMessage>
					<CardMessage Name="Rem" Recent="I love you too" Status="offline" Time="30m"></CardMessage>
					<CardMessage Name="Rem" Recent="I love you too" Status="offline" Time="30m"></CardMessage>
					<CardMessage Name="Rem" Recent="I love you too" Status="offline" Time="30m"></CardMessage>
					<CardMessage></CardMessage>
					<CardMessage></CardMessage>
					<CardMessage></CardMessage>
					<CardMessage></CardMessage>
					<CardMessage></CardMessage>
			</ScrollView>					 */}
			<FlatList
				data={chatRooms}
				renderItem={renderItem}
				keyExtractor={item => item.chatInfo._id}
				// style={styles.flatList}
			/>
		</View>
		<View style={styles.navbar}>
			<Text>Hello</Text>

		</View>
				
	  </View>
	);
  };
  
  export default ScreenMess;
registerRootComponent(ScreenMess);