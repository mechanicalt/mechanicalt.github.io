// @flow
import React from 'react'
import Markdown from 'react-markdown'
import Input from 'ui/Input'
import Button from 'ui/Button'
import { connect } from 'react-redux'
import * as ToDoActions from 'actions/todos'
import {demandBoost} from 'reducers/todos'

const e1md = `## Exercise 1: 

  The cost of each widget: 5 experimental dollars.

  Sales price of each widget: 10 experimental dollars.
`

const e2md = `## Exercise 2:

  Cost per widget: 5 experimental dollars.

  Sales price per widget: 10 experimental dollars.

  Order quantity: ${500 + demandBoost} units.
  
  Realised demand: ${800 + demandBoost} units.
`

const data = {
  high: {
    e1: {
      questions: [
        'If you order 200 widgets and demand is 500, how many widgets have you sold? _______ widgets',
        'If you order 200 widgets and demand is 500, how many widgets do you have leftover? _______ widgets',
        'If you order 600 widgets and demand is 500, how many widgets have you sold? 	_______ widgets',
        'If you order 600 widget and demand is 500, how many widgets do you have leftover? _______ widgets',
      ],
      answers: {
        'If you order 200 widgets and demand is 500, how many widgets have you sold? _______ widgets': 200,
        'If you order 200 widgets and demand is 500, how many widgets do you have leftover? _______ widgets': 0,
        'If you order 600 widgets and demand is 500, how many widgets have you sold? 	_______ widgets': 500,
        'If you order 600 widget and demand is 500, how many widgets do you have leftover? _______ widgets': 100,
      }
    },
    e2: {
      questions: [
        'How many widgets are unsold? _______',
        'How many widgets are sold? _______',
        'How many widgets did you miss out on selling? _______',
        'What is the total revenue? _______ experimental dollars',
        'What is the total cost? _______ experimental dollars',
        'What is the total profit? _______ experimental dollars',
      ],
      answers: {
        'How many widgets are unsold? _______': 0,
        'How many widgets are sold? _______': 500,
        'How many widgets did you miss out on selling? _______': 300,
        'What is the total revenue? _______ experimental dollars': 5000,
        'What is the total cost? _______ experimental dollars': 2500,
        'What is the total profit? _______ experimental dollars': 2500,
      }
    },
  },
  low: {
    e1: {
      questions: [
        'If you order 1200 widgets and demand is 1500, how many widgets have you sold? _______ widgets',
        'If you order 1200 widgets and demand is 1500, how many widgets do you have leftover? _______ widgets',
        'If you order 1500 widgets and demand is 1400, how many widgets have you sold? _______ widgets',
        'If you order 1500 widget and demand is 1400, how many widgets do you have leftover? _______ widgets',
      ],
      answers: {
        'If you order 1200 widgets and demand is 1500, how many widgets have you sold? _______ widgets': (1200),
        'If you order 1200 widgets and demand is 1500, how many widgets do you have leftover? _______ widgets': (0),
        'If you order 1500 widgets and demand is 1400, how many widgets have you sold? _______ widgets': (1400),
        'If you order 1500 widget and demand is 1400, how many widgets do you have leftover? _______ widgets': (100),
      }
    },
    e2: {
      questions: [
        'How many widgets are unsold? _______',
        'How many widgets are sold? _______',
        'How many widgets did you miss out on selling? _______',
        'What is the total revenue? _______ experimental dollars',
        'What is the total cost? _______ experimental dollars',
        'What is the total profit? _______ experimental dollars',
      ],
      answers: {
        'How many widgets are unsold? _______': 0,
        'How many widgets are sold? _______': 1000,
        'How many widgets did you miss out on selling? _______': 300,
        'What is the total revenue? _______ experimental dollars': 10000,
        'What is the total cost? _______ experimental dollars': 5000,
        'What is the total profit? _______ experimental dollars': 5000,
      }
    }
  }
}

const getAnswers = (quest) => {
  const e1 = getFinalFormat(quest.e1)
  const e2 = getFinalFormat(quest.e2)
  return {
    e1,
    e2
  }
}

const getFinalFormat = (e) => {
  return e.questions.reduce((finalResult, question) => {
    finalResult[question] = {
      value: '',
      correctAnswer: e.answers[question],
      error: '',
    }
    return finalResult
  }, {})
}

class TestUnderstanding extends React.Component {
  state = getAnswers(demandBoost ? data.low : data.high)
  constructor (props) {
    super(props)
    this.attempts = 0
  }
  componentDidMount = () => {
    window.scrollTo(0, 0)
  }
  handleChange = (type, question, value) => {
    this.setState({
      ...this.state,
      [type]: {
        ...this.state[type],
        [question]: {
          ...this.state[type][question],
          value,
        }
      }
    })
  }
  checkForErrors = (currentState) => {
    return Object.keys(currentState).reduce((finalResult, question) => {
      if (finalResult) return finalResult
      if (currentState[question].error) return true
      return false
    }, false)
  }
  getErrors = (type) => {
    const nextState = Object.keys(this.state[type]).reduce((finalResult, question) => {
      if (finalResult[question].correctAnswer === Number(finalResult[question].value) && finalResult[question].value !== '') {
        finalResult[question].error = ''
      } else {
        finalResult[question].error = 'This is not the correct value'
      }
      return finalResult
    }, this.state[type])
    this.setState((state, props) => ({
      ...state,
      [type]: nextState
    }))
    return this.checkForErrors(nextState)
  }
  submit = () => {
    ++this.attempts
    if (!this.getErrors('e1') & !this.getErrors('e2')) this.props.goToGame(this.attempts)
  }
  renderQuestions = (type) => {
    return Object.keys(this.state[type]).map((question) => {
      return <div><span>{question}</span><Input key={question} {...this.state[type][question]} onChange={(value) => this.handleChange(type, question, value)} /></div>
    })
  }
  render () {
    const source = `# Test Understanding of Game
  To check your understanding of the game, please answer the following questions. You may not proceed to the game without correctly answering these questions. Failure to answer the questions in a reasonable number of attempts may result in forfeiting the bonus payment due to lack of effort/comprehension of the task.
`
    return <div>
      <Markdown source={source} />
      <Markdown source={e1md} />
      {this.renderQuestions('e1')}
      <Markdown source={e2md} />
      {this.renderQuestions('e2')}
      <Button onClick={this.submit}>Check Answers And Go To Game</Button>
    </div>
  }
}

const mapDispatchToProps = (dispatch) => ({
  goToGame: (attempts) => dispatch(ToDoActions.testUnderstanding(attempts)),
})

export default connect(null, mapDispatchToProps)(TestUnderstanding)
