import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRoute } from "@react-navigation/native";

import ToDoItem from "../components/ToDoItem";

import { Text, View } from "../components/Themed";

const GET_PROJECT = gql`
  query getTaslist($id: ID!) {
    getTaskList(id: $id) {
      id
      title
      createdAt
      todos {
        id
        content
        isCompleted
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation createToDo($content: String!, $taskListId: ID!) {
    createToDo(content: $content, taskListId: $taskListId) {
      id
      content
      isCompleted

      taskList {
        id
        progress
        todos {
          id
          content
          isCompleted
        }
      }
    }
  }
`;

let id = "4";

export default function ToDoScreen() {
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");

  const route = useRoute();
  const id = route.params.id;

  const { data, error, loading } = useQuery(GET_PROJECT, { variables: { id } });

  const [createTodo, { data: createTodoData, error: createTodoError }] =
    useMutation(CREATE_TODO, { refetchQueries: [GET_PROJECT] });

  useEffect(() => {
    if (error) {
      console.log(error);
      Alert.alert("Error fetching project", error.message);
    }
  }, [error]);

  
  useEffect(() => {
    if (data) {
      setProject(data.getTaskList);
      setTitle(data.getTaskList.title);
    }
  }, [data]);

  const createNewItem = () => {
    createTodo({
      variables: {
        content: "",
        taskListId: id,
      },
    });
  };

  if (!project) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.buttonbox}>
            <TouchableOpacity onPress={() => { createNewItem() }}>
              <View style={styles.button}>
                <Text style={styles.addText}>+</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ padding: 10, paddingRight: 250 }}>Add tasks</Text>
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={"Title"}
            style={styles.title}
          />

          <FlatList
            data={project.todos}
            renderItem={({ item, index }) => (
              <ToDoItem todo={item} onSubmit={() => createNewItem()} />
            )}
            style={{ width: "100%" }}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  buttonbox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: 'center',
    alignItems: "center",
  },
  title: {
    width: "100%",
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    width: 36,
    height: 36,
    backgroundColor: "#008000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  delButton: {
    width: 36,
    height: 36,
    backgroundColor: "#BA0709",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  buttontext: {
    alignItems: "center",
  },
  addText: {
    color: "white",
    fontWeight: "bold",
  },
});
