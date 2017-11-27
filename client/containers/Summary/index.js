
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _, { startCase, camelCase } from 'lodash'
import * as todoSelectors from 'selectors/todos'
import * as TodoActions from 'actions/todos'
import * as routerActions from 'actions/router'
import Button from 'ui/Button'
import blacklist from 'blacklist'

class Summary extends Component {
  render () {
    const { results, actions, children, goToChoose } = this.props
    const lastResultIndex = results.length
    const lastResult = results[lastResultIndex - 1]
    return (
      <div>
        <h3>{`Summary For Round ${lastResultIndex}`}</h3>
        <table>
          <tbody>
            {
              Object.keys(blacklist(lastResult, 'time')).map((key) => {
                return <tr><td>{startCase(camelCase(key))}</td><td>{lastResult[key]}</td></tr>
              })
            }
          </tbody>
        </table>
        <Button onClick={goToChoose}>{this.props.attempt % 20 === 0 ? 'See Total Results' : 'Okay, next round!'}</Button>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    results: todoSelectors.getCurrentResults(state),
    attempt: state.todos.attempt
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    goToChoose: () => props.attempt % 20 !== 0 ? dispatch(TodoActions.toggleSummary()) : dispatch(routerActions.goToResults())
  }
}

export default _.flowRight([
  connect(
    mapStateToProps
  ),
  connect(
    null,
    mapDispatchToProps
  )
])(Summary)
