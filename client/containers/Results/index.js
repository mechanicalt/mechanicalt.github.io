import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import * as routerActions from 'actions/router'
import _ from 'lodash'
import { postResults, priceCost } from 'reducers/todos'
import Checkbox from 'ui/Checkbox'
import Button from 'ui/Button'
import TextInput from 'ui/Input'

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
    return (<div>
      <h3>Final Results</h3>
      <p>Thank you for completing the game. Your results are as follows:</p>
      <table>
        <tbody>
          <tr>
            <td>
              Total Profit:
            </td>
            <td>
              {`$${this.props.profit}`}
            </td>
          </tr>
          {
            <div>{`Total Performance Bonus: $${Math.round(100 * (this.props.profit) / priceCost.divisor) / 100}`}</div>
          }
        </tbody>
      </table>

      <div>
        <Checkbox onChange={this.onChange.bind(this, 'receive')} checked={this.state.receive} label="I would like to receive a copy of the study results via email or post, I have provided my details below and ask that they be used for this purpose only"/>
        <div><span>Name: <TextInput value={this.state.name} onChange={this.onChange.bind(null, 'name')} /></span></div>
        <div><span>Address: <TextInput value={this.state.address} onChange={this.onChange.bind(null, 'address')} /></span></div>
        <div><span>Email Address: <TextInput value={this.state.emailAddress} onChange={this.onChange.bind(null, 'emailAddress')} type="email"/></span></div>
      </div>
      {
        <Button onClick={this.submit}>Submit Results</Button>
      }

    </div>)
  }
}

const mapStateToProps = (state) => {
  const lastResultIndex = state.todos.results.length - 1
  return {
    todos: state.todos,
    attempt: state.todos.attempt,
    profit: _.get(state.todos.results[lastResultIndex] || {}, 'cumulativeProfit')
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
