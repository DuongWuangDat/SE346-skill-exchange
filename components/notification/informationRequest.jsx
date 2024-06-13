import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "@constants";
import { Image } from "expo-image";
import { BackHeader } from "..";
import { Topic } from "..";
import { CircleButton } from "..";
import { router } from "expo-router";
import avatarDefault from "@assets/images/avatarDefault.jpg";
import { useAction } from "../../utils/useAction";
import { useSession } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";

const InformationRequest = ({ 
	username,
	skill,
	birthDay,
	userTopicSkill,
	avatar,
	imageCerti,
	description,
	_id,
	idRequest 
}) => {
	
	const { user } = useSession();
	const navigation = useNavigation();
	const swipeLeft = useAction((state) => state.swipeLeft);
	const swipeRight = useAction((state) => state.swipeRight);
	const createChat= async (id1,id2)=>{
        const token= await AsyncStorage.getItem('accessToken');
		console.log(id1+", "+id2);
        try{
            const response= await fetch('https://se346-skillexchangebe.onrender.com/api/v1/chat/create',{
			method:'POST',
			headers:{
			  'Content-Type': 'application/json',
			  Authorization:`Bearer ${token}`
			},
			body: JSON.stringify({
				"firstID": id1,
				"secondID": id2
			})
		  })
		  if(response.status==200)
		  {
			return true
		  }
		  else{
            Alert.alert(
                'Thông báo', 
                'Kết bạn không thành công', 
            )
			return false
		  }
        }
        catch{
            Alert.alert(
                'Thông báo', 
                'Kết bạn không thành công', 
            )
            return false
         }
		 
    }
	const deleteRequest=async ()=>{
		console.log(idRequest);
        try {
            const token= await AsyncStorage.getItem('accessToken');
            const response = await fetch(`https://se346-skillexchangebe.onrender.com/api/v1/request/delete/${idRequest}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization:`Bearer ${token}`,
              }
            });
            console.log(response.status)
      
            if(response.status==200)
            {
                const json = await response.json();
                if(json.message=="Deleted request successfully")
                {
                  console.log("delete success");
                }
             
            }
            else
            {
                console.log("error"+response.statusText);
              
            }
          } catch (error) {
            console.error(error);
          } finally {
            navigation.goBack('(tabs)');
          }
    }
	const handlePressAccept= async ()=>{
		if( await createChat(_id,user.id))
		{
			await deleteRequest();
			navigation.goBack('(tabs)');
		}
			
		
	 }

	function convertDate(isoDate) {
		const date = new Date(isoDate);
		const formattedDate = date.toLocaleDateString("en-GB");
		return formattedDate;
	}

	const handleBackButton = () => {
		router.back();
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: "white",
			}}
		>
			<Stack.Screen
				options={{
					title: "Information",
					headerShown: true,
					headerShadowVisible: true,
					headerBackVisible: false,
					headerTitle: (props) => (
						<BackHeader
							{...props}
							headerText={username}
							handleBackButton={handleBackButton}
						/>
					),
				}}
			/>
			<View style={styles.buttonContainer}>
				<CircleButton
					iconUrl={require("@assets/icons/cancel.svg")}
					handlePress={() => {
						deleteRequest();
					}}
				/>
				<CircleButton
					iconUrl={require("@assets/icons/tickCircle.svg")}
					handlePress={() => {
						handlePressAccept();
					}}
				/>
			</View>

			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={styles.container}>
					<View style={styles.avatar}>
						<Image
							style={{ width: "100%", height: "100%" }}
							placeholder={avatarDefault}
							source={{
								uri: avatar,
							}}
						/>
					</View>

					<View style={styles.boxContainer}>
						<Text style={styles.headerText}>Description</Text>
						<Text style={styles.detailText}>{description}</Text>

						<Text style={styles.headerText}>Birthday</Text>
						<Text style={styles.detailText}>{convertDate(birthDay)}</Text>
					</View>

					<View style={styles.boxContainer}>
						{skill?.length > 0 ? (
							<>
								<Text style={styles.headerText}>Skill description</Text>
								<View style={styles.skillContainer}>
									{skill?.map((item, index) => (
										<Text key={index} style={styles.detailText}>
											{item}
										</Text>
									))}
								</View>
							</>
						) : null}
						<Text style={styles.headerText}>Topic</Text>
						<View style={styles.topicContainer}>
							{userTopicSkill?.map((topic, index) => (
								<Topic
									key={index}
									style={styles.detailText}
									topicContent={topic.name}
								/>
							))}
						</View>

						{imageCerti?.length > 0 ? (
							<>
								<Text style={styles.headerText}>Certification</Text>
								<View style={styles.certiContainer}>
									{imageCerti.map((certi, index) => (
										<Image
											key={index}
											source={certi}
											contentFit="cover"
											style={{ width: "100%", height: 300, borderRadius: 10 }}
										/>
									))}
								</View>
							</>
						) : null}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		// justifyContent: "center",
		gap: 13,
		alignItems: "center",
		paddingVertical: 10,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 1000,
		shadowColor: COLORS.shadowBlue,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 10,
		overflow: "hidden",
	},
	boxContainer: {
		width: "100%",
		paddingHorizontal: 20,
		paddingVertical: 15,
		gap: 9,
		backgroundColor: COLORS.lightWhite,
		borderRadius: 10,
		shadowColor: COLORS.shadowBlue,
		elevation: 5,
	},
	headerText: {
		fontSize: 14,
		fontFamily: "SegoeUI",
		fontWeight: "bold",
		color: "#606060",
	},
	detailText: {
		fontSize: 15,
		fontFamily: "NotoRegular",
		lineHeight: 15 * 1.5,
	},
	topicContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 13,
	},
	skillContainer: {
		flexDirection: "row",
		gap: 13,
	},
	certiContainer: {
		gap: 10,
	},
	buttonContainer: {
		gap: 30,
		paddingBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		bottom: 10,
		zIndex: 100,
		width: "100%",
	},
});

export default InformationRequest;