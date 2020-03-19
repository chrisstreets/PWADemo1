import React, {useEffect, useReducer} from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
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
  state = {
		name: '',
		description: '',
		todos: []
  };
  
 /* uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;

    Storage.put(name, file).then(() => {
      this.setState({ file: name });
    })
  } */

  async componentDidMount() {
    Analytics.record('Amplify_CLI');
    try {
			const todos = await API.graphql(graphqlOperation(listTodos));
			console.log('todos: ', todos);
			this.setState({ todos: todo.data.listTodos.items });
		} catch (err) {
			console.log('error: ', err);
		}
	}
  
  onChangeText = (key, val) => {
		this.setState({ [key]: val });
	};

  

  todoMutation = async () => {
    if(this.state.name == '' || this.state.description == '')return;

    const todoDetails = {name: this.state.name, description: this.state.description};
      try{
        const todos = [...this.state.todos, todo];
        this.setState({todos, name: '', description: ''});
        console.log('todos: ', todos);
        await API.graphql(graphqlOperation(addTodo, todoDetails));
        console.log('succes');
      }catch (err){
        console.log('error', err);
    };
  
    
    
  };
  
  /* listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  }; */

  
  
  
  render() {
    return (
      <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={this.state.name}
        onChangeText={val => this.onChangeText('name', val)}
        placeholder="What do you want to read?"
      />
      <TextInput
        style={styles.input}
        value={this.state.description}
        onChangeText={val => this.onChangeText('description', val)}
        placeholder="Who wrote it?"
      />
      <Button onPress={this.addTodo} name="Add to TBR" color="#eeaa55" />
      {this.state.todos.map((todo, index) => (
        <View key={index} style={styles.todo}>
          <Text style={styles.name}>{todo.name}</Text>
          <Text style={styles.description}>{todo.description}</Text>
        </View>
      ))}
    </View>
  );
}
}
     
      /* <div className="App">
      <p> Pick a file</p>
      <input type="file" onChange={this.uploadFile} />
      <button onClick={this.listQuery}>GraphQL Query</button>
      <button onClick={this.todoMutation}>GraphQL Mutation</button>
      <S3Album level="private" path='' />
    </div>
    );
  }
} */



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 10,
		paddingTop: 50
	},
	input: {
		height: 50,
		borderBottomWidth: 2,
		borderBottomColor: 'blue',
		marginVertical: 10
	},
	todo: {
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		paddingVertical: 10
	},
	name: { fontSize: 16 },
	description: { color: 'rgba(0, 0, 0, .5)' }
});  

export default withAuthenticator(App, true);