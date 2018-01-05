// @flow
import React from 'react'
import Markdown from 'react-markdown'
import Input from 'ui/Input'
import Button from 'ui/Button'
import style from './style.css'
import * as actions from 'actions/router'
import * as TodoActions from 'actions/todos'
import {connect} from 'react-redux'

const questions = [
  'Betting a day’s income at the horse races',
  'Investing 10% of your annual income in a moderate growth mutual fund',
  'Betting a day’s income at a high-stake poker game',
  'Investing 5% of your annual income in a very speculative stock',
  'Betting a day’s income on the outcome of a sporting event',
  'Investing 10% of your annual income in a new business venture',
]
const answers = questions.reduce((finalResult, question)=>{
  finalResult[question] = ''
  return finalResult
}, {})

class RiskAdverse extends React.PureComponent {
  state = {
    answers
  }
  handleChange = (question, num) => {
    let finalNum = Number(num)
    if (finalNum < 1) {
      finalNum = 1
    }
    if (finalNum > 7) {
      finalNum = 7
    }
    const nextState = {
      answers: {
        ...this.state.answers,
        [question]: finalNum
      }
    }
    this.setState(nextState)
  }
  isValid = () => {
    return questions.reduce((finalResult, question) => {
      if (!finalResult) {
        return finalResult
      }
      if (this.state.answers[question]) {
        return true
      }
      return false
    }, true)
  }
  submit = () => {
    if (this.isValid()) this.props.goToGame(this.state.answers)
  }
  render () {
    const source = `# Pregame Survey
For each of the following statements, please indicate the likelihood that you would engage in the described activity or behavior if you were to find yourself in that situation. Provide a rating from Extremely Unlikely to Extremely Likely, using the following scale: 

1 | 2 | 3 | 4 | 5 | 6 | 7
:---: | :---: | :---: | :---: | :---: | :---: | :---:
Extremely Unlikely | Moderately Unlikely | Somewhat Unlikely | Neither likely nor unlikely | Somewhat Likely | Moderately Likely | Extremely Likely
`
    return <div className={style.table}>
      <Markdown source={source} />
      <br />
      <div>
        {questions.map((question) => {
          return <div><span>{question}</span><Input type="number" value={this.state.answers[question]} onChange={(num) => this.handleChange(question, num)} /><br /></div>
        })}
      </div>
      <Button disabled={!this.isValid()} className={style.button} onClick={this.submit}>Proceed To Instructions</Button>
    </div>
  }
}

function mapDispatchToProps (dispatch) {
  return {
    goToGame: (state) => dispatch(TodoActions.riskAdverse(state))
  }
}

export default connect(null, mapDispatchToProps)(RiskAdverse)
