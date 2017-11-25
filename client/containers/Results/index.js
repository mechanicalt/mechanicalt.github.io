import React from 'react'
import Markdown from 'react-markdown'
import Button from 'ui/Button'
import { connect } from 'react-redux'
import $ from 'jquery'
import * as routerActions from 'actions/router'
import _ from 'lodash'
import { postResults } from 'reducers/todos'

class Results extends React.PureComponent {
  state = {
    name: '',
    address: '',
    emailAddress: '',
    receive: false
  }
  onChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }
  submit = () => {
    const finalResults = {
      ...this.props.todos,
      receiveResults: this.state
    }
    postResults(finalResults)
    $('#results').val(JSON.stringify(finalResults))
    $('#results').closest('form').submit()
  }
  render () {
    const finishedSecondGame = this.props.attempt === 40
    return (<div>
      <h3>Final Results</h3>
      <p>Thank you for completing the game. Your results are as follows:</p>
      <table>
        <tbody>
          <tr>
            <td>
              Game 1 Total Profit:
            </td>
            <td>
              {`$${this.props[`${this.props.firstGame}Profit`]}`}
            </td>
          </tr>
          {
            finishedSecondGame && <tr>
              <td>
              Game 2 Total Profit:
              </td>
              <td>
                {`$${this.props[`${this.props.firstGame === 'uni' ? 'bi' : 'uni'}Profit`]}`}
              </td>
            </tr>
          }

        </tbody>
      </table>
      {
        finishedSecondGame && <div>
          <Checkbox onChange={this.handleChange.bind(this, 'receive')} checked={this.state.receive} label="I would like to receive a copy of the study results via email or post, I have provided my details below and ask that they be used for this purpose only"/>
          <div><span>Name: <TextInput value={this.state.name} onChange={this.onChange.bind(null, 'name')} /></span></div>
          <div><span>Address: <TextInput value={this.state.address} onChange={this.onChange.bind(null, 'address')} /></span></div>
          <div><span>Email Address: <TextInput value={this.state.emailAddress} onChange={this.onChange.bind(null, 'emailAddress')} type="email"/></span></div>
        </div>
      }
      {
        finishedSecondGame ? <Button onClick={this.submit}>Submit Results</Button>
          : <Button onClick={this.props.goToGame}>Go To Final Game</Button>
      }

    </div>)
  }
}

const mapStateToProps = (state) => {
  const uniLastResultIndex = state.todos.uniResults.length - 1
  const biLastResultIndex = state.todos.biResults.length - 1
  return {
    todos: state.todos,
    firstGame: state.todos.firstGame,
    uni: state.todos.uni,
    attempt: state.todos.attempt,
    uniProfit: _.get(state.todos.uniResults[uniLastResultIndex] || {}, 'cumulativeProfit'),
    biProfit: _.get(state.todos.biResults[biLastResultIndex] || {}, 'cumulativeProfit')
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    goToGame: () => {
      dispatch(routerActions.goToGame(true))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results)
