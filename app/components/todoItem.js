import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native'
import PropTypes from 'prop-types'

const {width, height} = Dimensions.get('window')

export default class ToDo extends Component {

  constructor (props) {
    super(props)
    this.state = {isEditing: false, todoValue: props.text}
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    remove: PropTypes.func.isRequired,
    completeToDo: PropTypes.func.isRequired,
    uncompleteToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired
  }

  render () {
    const {isEditing, todoValue} = this.state
    const {isCompleted, text, id, remove} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View style={[styles.radio, isCompleted ? styles.radioOn : styles.radioOff]}/>
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              multiline={true}
              style={[styles.todoText, styles.input, isCompleted ? styles.textOn : styles.textOff]}
              value={todoValue}
              onChangeText={this._controllerInput}
              returnKeyType={'done'}
              autoCorrect={false}
              onBlur={this._finishEditing}
            />
          ) : (
            <Text style={[styles.todoText, isCompleted ? styles.textOn : styles.textOff]}>{text}</Text>
          )}

        </View>
        {isEditing ?
          <View style={styles.action}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
          :
          <View style={styles.action}>
            <TouchableOpacity onPressOut={this._startEdited}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPressOut={(event) => {event.stopPropagation; remove(id)}}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>

        }
      </View>
    )
  }

  _toggleComplete = (event) => {
    event.stopPropagation();
    const {completeToDo, uncompleteToDo, isCompleted, id} = this.props
    if (!isCompleted) {
      return completeToDo(id)
    }
    uncompleteToDo(id)

  }
  _startEdited = (event) => {
    event.stopPropagation();
    this.setState({isEditing: true})
  }
  _finishEditing = (event) => {
    event.stopPropagation();
    const {todoValue} = this.state;
    const {id, updateToDo} = this.props;
    updateToDo(id, todoValue)
    this.setState({isEditing: false})
  }
  _controllerInput = text => {
    this.setState({todoValue: text})
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  radio: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 5,
    borderWidth: 3,

  },
  radioOn: {
    borderColor: '#bbb'
  },
  radioOff: {
    borderColor: '#ff9a30',
  },
  todoText: {
    fontWeight: '600',
    fontSize: 18,
    marginVertical: 20,
    width: (width / 2) - 5,
  },
  textOn: {
    color: '#bbb',
    textDecorationLine: 'line-through'
  },
  textOff: {
    color: '#353535'
  },
  column: {
    width: width / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',

  },
  actionContainer: {
    margin: 10
  },
  input: {
    marginTop: 15,
    marginBottom: 20
  }
})