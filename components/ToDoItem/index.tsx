import { View, Text, TextInput, StyleSheet, Appearance, PlatformColor } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import React, {useState, useEffect, useRef} from 'react';
import Checkbox from '../Checkbox';

interface ToDoItemProps {
    todo: {
        id: string;
        content: string;
        isCompleted: boolean;
    },
    onSubmit: () => void
}

const UPDATE_TODO = gql`
mutation updateToDo($id: ID!, $content:String, $isCompleted: Boolean) {
  updateToDo(id: $id, content: $content, isCompleted: $isCompleted) {
    id
    content
    isCompleted
    taskList {
      title
      todos {
        id
        content
        isCompleted
      }
    }
  }
}
`;

const TodoItem = ({ todo, onSubmit }: ToDoItemProps) => {
  const [isChecked, setisChecked] = useState(false);
  const [text, setText] = useState("");

  const [updateItem] = useMutation(UPDATE_TODO);
  const input = useRef(null);
  
  
  const callUpdateItem = () => {
    updateItem({
      variables: {
        id: todo.id,
        content: text,
        isCompleted: isChecked,
      }
    })
  };
  
  

  useEffect(() => {
    if(!todo) { return }

    setisChecked(todo.isCompleted);
    setText(todo.content)
  }, [todo])

  useEffect(() => {
    if (input.current) {
        input?.current?.focus();
    }
  }, [input])

  const onKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && text === '') {
        console.warn('delete item');
    }
  }

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}
    >
      {/* text input */}
      <TextInput
        ref={input}
        value={text}
        onChangeText={setText}
        style={{
          flex: 1,
          fontSize: 18,
          marginLeft: 12,
          ...Platform.select({
            ios: {
              color: PlatformColor("labelColor"),
              backgroundColor: PlatformColor("tertiarySystemBackground"),
              borderColor: PlatformColor("separator"),
            },
            android: {
              color: "black",
            },
          }),
        }}
        multiline="false"
        onEndEditing={() => callUpdateItem()}
        onKeyPress={onKeyPress}
        textAlignVertical="top"
      />
      {/* Checkbox */}
      <Checkbox
        isChecked={isChecked}
        onPress={() => {
          setisChecked(!isChecked);
          callUpdateItem();
        }}
      />
    </View>
  );
}

export default TodoItem