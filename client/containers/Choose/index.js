import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import classnames from 'classnames'
import * as TodoActions from 'actions/todos'
import Button from 'ui/Button'
import TextInput from 'ui/Input'
import * as todoSelectors from 'selectors/todos'
import * as u from 'utils'
import style from './style.css'
import { biGraphSrc } from '../../utils/index';

class Choose extends Component {
  state = {
    unitsToOrder: ''
  }
  stopSubmit = (event) => {
    if (event.key === 'Enter') {
      this.props.submitResult(this.state.unitsToOrder)
    }
  }
  handleChangeUnitsToOrder = (unitsToOrder) => {
    if (Number.isNaN(unitsToOrder)) {
      return this.setState({
        unitsToOrder: 0
      })
    }
    if (unitsToOrder < 0) {
      return this.setState({
        unitsToOrder: 0
      })
    }
    if (unitsToOrder > 400) {
      return this.setState({
        unitsToOrder: 400
      })
    }
    return this.setState({
      unitsToOrder: Math.round(unitsToOrder)
    })
  }
  render () {
    const { results, actions, children, submitResult, price, cost, uni } = this.props
    const { unitsToOrder } = this.state
    return (
      <div>
        <h2>{`Game ${this.props.attempt <= 20 ? 1 : 2} - ${uni ? 'Uni' : 'Bi'}modal Distribution`}</h2>
        <img className={style.graph} src={uni ? u.uniGraphSrc : biGraphSrc} />
        <h3>Choose Order Quantity</h3>
        <p>Select your order quantity and enter it into the text field. Remember that demand is between 0 and 400.</p>
        <div>
          <div className={style.half}>
            <table>
              <tbody>
                <tr><td><strong>Round:</strong></td><td>{`${results.length + 1}${results.length <= 4 ? ' - Practice' : ''}`}</td></tr>
                <tr><td><strong>Sales Price:</strong></td><td>{`$${price}`}</td></tr>
                <tr><td><strong>Cost:</strong></td><td>{`$${cost}`}</td></tr>
              </tbody>
            </table>
          </div>
          <div className={style.half}>
            <span>Units to order: <TextInput onKeyPress={this.stopSubmit} value={this.state.unitsToOrder} onChange={this.handleChangeUnitsToOrder} type="number" /></span>
            <Button onClick={() => submitResult(this.state.unitsToOrder)} disabled={unitsToOrder === ''}>Submit Order</Button>
          </div>
        </div>
        {
          results.length > 0 && <table className={style.historyTable}>
            <tbody>
              <tr>
                <th>
                Round
                </th>
                {Object.keys(results[0]).map((key) => {
                  if (key === 'time') return null
                  return <th>{_.startCase(_.camelCase(key))}</th>
                })}
              </tr>
              {
                results.map((r, i) => {
                  return (<tr className={classnames({
                    [style.practice]: i <= 4
                  })}>
                    <td>{i + 1}</td>
                    {
                      Object.keys(r).map(key => {
                        if (key === 'time') return null
                        return <td>{r[key]}</td>
                      })
                    }
                  </tr>)
                })
              }
            </tbody>
          </table>
        }

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    uni: state.todos.uni,
    attempt: state.todos.attempt,
    results: todoSelectors.getCurrentResults(state),
    price: state.todos.price,
    cost: state.todos.cost
  }
}

function mapDispatchToProps (dispatch) {
  return {
    submitResult: bindActionCreators(TodoActions.submitResult, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Choose)
