import React from "react";
import styled from "styled-components";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface ProjectItemProps {
  project: {
    id: string,
    title: string,
    createdAt: string,
    progress: string,
  }
}


const ProjectItem = ({ project }: ProjectItemProps) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("Project", { id: project.id });
  }

    return (
    <Pressable onPress={onPress} style={styled.root}>
      <Container>
        <Cover>
          <Title>{project.title}</Title>
        </Cover>
        <Content>
          <Wrapper>
            <Caption>{project.createdAt}</Caption>
            <Subtitle>{project.progress}</Subtitle>
          </Wrapper>
        </Content>
      </Container>
    </Pressable>
  )

};




const Content = styled.View`
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
  height: 80px;
`;

const Logo = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
`;

const Caption = styled.Text`
  color: #3c4560;
  font-size: 20px;
  font-weight: 600;
`;

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-top: 4px;
`;

const Wrapper = styled.View`
  margin-left: 10px;
`;

const Container = styled.View`
  background: white;
  width: 315px;
  height: 280px;
  border-radius: 14px;
  margin-left: 20px;
  margin-top: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
`;

const Cover = styled.View`
  width: 100%;
  height: 200px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  overflow: hidden;
`;

const Title = styled.Text`
  color: black;
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
  width: 170px;
`;

export default ProjectItem;