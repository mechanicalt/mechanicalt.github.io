import React from 'react'
import Markdown from 'react-markdown'
import Button from 'ui/Button';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as routerActions from 'actions/router'
import _ from 'lodash'

class Results extends React.PureComponent {
  nextPage = ()=>{

  }
  submit = ()=>{
    $('#results').closest('form').submit()
  }
  render(){
    return <div>
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
            this.props.attempt > 20 && <tr>
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
        this.props.attempt === 40 ? <Button onClick={this.submit}>Submit Results</Button> :
        <Button onClick={this.props.goToGame}>Go To Final Game</Button>
      }
      
    </div>
  }
}

const mapStateToProps = (state)=>{
  const uniLastResultIndex = state.todos.uniResults.length - 1;
  const biLastResultIndex = state.todos.biResults.length - 1;
  return {
    firstGame: state.todos.firstGame,
    uni: state.todos.uni,
    attempt: state.todos.attempt,
    uniProfit: _.get(state.todos.uniResults[uniLastResultIndex] || {}, 'cumulativeProfit'),
    biProfit: _.get(state.todos.biResults[biLastResultIndex] || {}, 'cumulativeProfit'),
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    goToGame: ()=>{
      dispatch(routerActions.goToGame(true))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results)