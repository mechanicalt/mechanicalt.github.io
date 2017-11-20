
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {startCase, camelCase} from 'lodash'
import * as TodoActions from '../../actions/todos'
import Button from '../../ui/Button'

class Summary extends Component {
  render() {
    const { results, actions, children, goToChoose } = this.props
    const lastResultIndex = results.length;
    const lastResult = results[lastResultIndex - 1];
    return (
      <div>
        <h3>{`Summary For Round ${lastResultIndex}`}</h3>
        <table>
          <tbody>
            {
              Object.keys(lastResult).map((key)=>{
                return <tr><td>{startCase(camelCase(key))}</td><td>{lastResult[key]}</td></tr>
              })
            }
          </tbody>
        </table>
        <Button onClick={goToChoose}>Okay, next round!</Button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    results: state.todos.results
  }
}

function mapDispatchToProps(dispatch) {
  return {
    goToChoose: bindActionCreators(TodoActions.toggleSummary, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary)
