/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import uuidv1 from 'uuid/v1'

import ToDo from './components/todoItem'

const {width, height} = Dimensions.get('window')

export default class App extends Component<Props> {
  state = {
    newToDo: '',
    loadedToDo: false,
    toDos: {}
  }

  componentDidMount = () => {
    this._loadToDos()
  }

  render () {
    const {newToDo, loadedToDo, toDos} = this.state
    if (loadedToDo) {
      SplashScreen.hide()
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>rocket.todo</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={'Start the new rocket...'} value={newToDo}
            onChangeText={this.controllerNewToDo}
            placeHolderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.todoItem}>
            {/*<ToDo text={'I want to Space 🚀'}/>*/}
            {Object.values(toDos).reverse().map(todo =>
              <ToDo
                key={todo.id}
                {...todo}
                remove={this._removeToDo}
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
              />
            )}
          </ScrollView>
        </View>
      </View>
    )
  }

  controllerNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem('toDos')
      const parsedToDos = JSON.parse(toDos)

      console.log('loaded', toDos)
      console.log('parsed', parsedToDos)
      this.setState({
        loadedToDo: true,
        toDos: toDos !== null ? parsedToDos : {}
      })

    }
    catch (err) {
      alert(err)
    }
  }
  _addToDo = () => {
    const {newToDo} = this.state
    if (newToDo !== '') {
      this.setState(prevState => {
        const ID = uuidv1()
        const newToDosObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            time: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newToDo: '',
          toDos: {
            ...prevState.toDos,
            ...newToDosObject
          }
        }
        this._saveToDos(newState.toDos)
        return {...newState}
      })
    }
  }
  _removeToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos
      delete toDos[id]

      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _completeToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos
      toDos[id].isCompleted = true
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos
      toDos[id].isCompleted = false
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const toDos = prevState.toDos
      toDos[id].text = text
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _saveToDos = newToDos => {
    console.log('create', newToDos)
    const saveToDos = AsyncStorage.setItem('toDos', JSON.stringify(newToDos))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191919',
  },
  title: {
    fontSize: 38,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 50,
    color: 'white',
    fontWeight: '200',
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(125, 125, 125)',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: 'rgba(125, 125, 125, 0.3)',
    borderBottomWidth: 1,
    fontSize: 20
  },
  todoItem: {
    alignItems: 'center'
  }

})
