import React, {useEffect, useReducer} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import Amplify, { Analytics, Storage, API, graphqlOperation } from 'aws-amplify';
import PubSub from '@aws-amplify/pubsub';
import { withAuthenticator, S3Album } from 'aws-amplify-react-native'


import config from './aws-exports'
API.configure(config)
PubSub.configure(config)
Amplify.configure(config)

const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

class App extends React.Component {
  uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;

    Storage.put(name, file).then(() => {
      this.setState({ file: name });
    })
  }

  componentDidMount() {
    Analytics.record('Amplify_CLI');
  }

  todoMutation = async () => {
    const todoDetails = {
      name: 'Party tonight!',
      description: 'Amplify CLI rocks!'
    };
  
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  };
  
  listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  };

  render() {
    return (
      <div className="App">
      <p> Pick a file</p>
      <input type="file" onChange={this.uploadFile} />
      <button onClick={this.listQuery}>GraphQL Query</button>
      <button onClick={this.todoMutation}>GraphQL Mutation</button>
      <S3Album level="private" path='' />
    </div>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddeefff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
});

export default withAuthenticator(App,true);