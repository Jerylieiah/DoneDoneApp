import React, { useState, useEffect, useCallback } from "react";
import { 
  StyleSheet, 
  FlatList, 
  Alert,  
  ScrollView, 
  SafeAreaView, 
  PlatformColor, 
  Button, 
  Dimensions, 
  Modal, 
  TextInput,
  Pressable,
  ActivityIndicator,
  Image
} from "react-native";
import ProjectItem from "../components/ProjectItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Text, View } from "../components/Themed";
import { useQuery, useMutation, gql } from "@apollo/client";
import styled from "styled-components";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import AwesomeButton from "react-native-really-awesome-button";


const MY_PROJECTS = gql`
  query myTaskLists {
    myTaskLists {
      id
      title
      createdAt
      progress
      users {
        name
      }
    }
  }
`;

const CREATE_PROJECT = gql`
mutation createTaskList($title:String!) {
  createTaskList(title: $title) {
    id
    createdAt
    title

    users {
      id
      name
    }
  }
}
`

const { width } = Dimensions.get("window");

export default function ProjectsScreen() {
  const [project, setProjects] = useState([]);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const navigation = useNavigation();
  
  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };
  
  

  const { data, error, loading, refetch } = useQuery(MY_PROJECTS);

  const [
    createProject, { data: createProjectData, error: createProjectError, loading: createProjectLoading }
  ] = useMutation(CREATE_PROJECT, { refetchQueries: [ MY_PROJECTS ] });

  const quotes = [
    "Today is an opportunity!",
    "Good things take time...",
    "Success comes to those who act...",
    "Every new day begins with possibilities...",
  ];
  
  const [number, setNumber] = React.useState(0);

  const getRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * quotes.length);
    setNumber(randomNumber);
  };
  
  useEffect(() => {
    const signOut = navigation.addListener('focus', () => {
      refetch();
      getRandomNumber();
    });
    
    return signOut;
  }, [navigation]);
  
  useEffect(() => {
    if (error) {
      Alert.alert("Error fetching projects", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProjects(data.myTaskLists);
    }
  }, [data]);

  /*if (project.length === 0) {
    return <ActivityIndicator />
  }*/
  
  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    navigation.dispatch(
      StackActions.replace('Login')
    );
  };
  
  const createNewProject = () => {
    toggleModalVisibility();
    createProject({
      variables: {
        title: inputValue,
      }
    });
  };
  
  return (
    <Container>
      <TitleBar>
        <Title>Home</Title>
          <AwesomeButton
            borderRadius={27}
            width={150}
            height={40}
            backgroundColor="#24a0ed"
            onPress={signOut}
            style={{ marginRight: 15, marginTop: 5 }}
          >
            Sign Out
          </AwesomeButton>
      </TitleBar>
      <TitleBar2>
        <Text style={{ fontSize: 18, color: "black", fontStyle: "italic", flex: 1 }}>
          {quotes[number]}
        </Text>
      </TitleBar2>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
      </View>
      <ProjectProgress>
        <Title2
          style={{
            paddingRight: 20
          }}>Project Progress</Title2>
        
        <AwesomeButton borderRadius={27} width={70} height={40} backgroundColor="#008000" onPress={toggleModalVisibility} style={{marginRight: 15}}>
          +
        </AwesomeButton>
        <Modal
          animationType='slide'
          transparent 
          visible={isModalVisible}
          presentationStyle="overFullScreen"
        >
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <Text style={{
                  color: 'black',
                  fontSize: 18,
                  fontWeight: 'bold',
                  paddingBottom: 15
                }}>Create New Project</Text>
              <TextInput placeholder="Name of Project" 
                         style={styles.textInput} 
                         onChangeText={setInputValue} />
  
                        {/** This button is responsible to close the modal */}
              <View style={styles.buttonWrapper}>
                <Pressable  
                  onPress={(value) => createNewProject()}
                  style = {styles.modalButton}>
                  <Text style={{
                          color: 'white',
                          fontSize: 15,
                          fontWeight: 'bold'
                        }}
                    >Confirm</Text>
                  </Pressable>
                  <Pressable  
                    onPress={() => toggleModalVisibility()}
                    style = {styles.modalButtonCancel}>
                  <Text style={{
                          color: 'white',
                          fontSize: 15,
                          fontWeight: 'bold'
                        }}
                    >Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View> 
        </Modal>
      </ProjectProgress>
      <CardContainer>
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ }}
          data={project}
          numColumns={2}
          horizontal={false}
          style={{ width: "100%" }}
          renderItem={({ item }) => <ProjectItem project={item} />}
        />
      </CardContainer>
    </Container>
  );
}

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 20px;
`;

const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  background: black;
  border-radius: 22px;
  margin-left: 20px;
  position: absolute;
  top: 0;
  left: 0%;
`;

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const CardContainer = styled.View`
  margin-top: 10px;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: #1E90FF;
  flex: 1;
  border-radius: 25px;
`;

const CardContainer2 = styled.View`
  margin-top: 10px;
  flex-direction: row;
  width: 30%;
  height: 20%;
  background-color: #FFFFF;
  border-radius: 20px;
`;

const ProjectButtons = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 20px;
  border-radius: 40px;
  border-width: thin;
`;

const Title = styled.Text`
  padding-right: 100px;
  flex: 1;
  font-size: 40px;
  color: #000000;
  font-weight: 600;
`;

const Title2 = styled.Text`
  padding-right: 100px;
  flex: 1;
  font-size: 25px;
  color: #000000;
  font-weight: 600;
`;

const Name = styled.Text`
  font-size: 20px;
  color: #3c4560;
  font-weight: bold;
`;

const TitleBar = styled.View`
  width: 100%;
  height: 7%;
  flex-direction: row;
  margin-top: 15px;
  padding-left: 30px;
`;

const TitleBar2 = styled.View`
  width: 100%;
  height: 10%;
  flex-direction: row;
  padding-left: 30px;
`;

const ProjectProgress = styled.View`
  flex-direction: row;
  padding-left: 30px;
  padding-top: 40px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  time: {
    color: "darkgrey",
  },
  blurContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonWrapper: {
    flexDirection: "row",
  },
  modalButton: {
    flexDirection: 'row',
    backgroundColor: '#24a0ed',
    height: 35,
    width: 130,
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  modalButtonCancel: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    height: 35,
    width: 130,
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) },
                { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
  },
});
