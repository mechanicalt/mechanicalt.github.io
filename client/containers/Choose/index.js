
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as TodoActions from '../../actions/todos';
import Button from '../../ui/Button';
import style from './style.css';

class Choose extends Component {
  state = {
    unitsToOrder: ''
  }
  stopSubmit = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
    }
  }
  handleChangeUnitsToOrder = (event) => {
    event.stopPropagation();
    const unitsToOrder = event.target.value;
    if (Number.isNaN(unitsToOrder)){
      return this.setState({
        unitsToOrder: 0,
      })
    }
    if (unitsToOrder < 0) {
      return this.setState({
        unitsToOrder: 0,
      })
    }
    if (unitsToOrder > 100) {
      return this.setState({
        unitsToOrder: 100,
      })
    }
    return this.setState({
      unitsToOrder,
    })
  }
  render() {
    const { results, actions, children, submitResult, price, cost } = this.props
    const { unitsToOrder } = this.state;
    return (
      <div>
        <h3>Choose Order Quantity</h3>
        <p>Select your order quantity and enter it into the text field. Remember that demand is between 0 and 100.</p>
        <div>
          <div className={style.half}>
            <table>
              <tbody>
                <tr><td><strong>Round:</strong></td><td>{`${results.length + 1}`}</td></tr>
                <tr><td><strong>Sales Price:</strong></td><td>{`$${price}`}</td></tr>
                <tr><td><strong>Cost:</strong></td><td>{`$${cost}`}</td></tr>
              </tbody>
            </table>
          </div>
          <div className={style.half}>
            <span>Units to order: <input onKeyPress={this.stopSubmit} value={this.state.unitsToOrder} onChange={this.handleChangeUnitsToOrder}type="number"></input></span>
            <Button onClick={()=>submitResult(this.state.unitsToOrder)} disabled={unitsToOrder === ''}>Submit Order</Button>
          </div>
        </div>
        {
          results.length > 0 && <table className={style.historyTable}>
          <tbody>
            <tr>
              <th>
                Round
              </th>
              {Object.keys(results[0]).map((key)=>{
                return <th>{_.startCase(_.camelCase(key))}</th>
              })}
            </tr>
            {
              results.map((r, i)=>{
                return <tr>
                  <td>{i + 1}</td>
                  {
                    Object.keys(r).map(key => {
                      return <td>{r[key]}</td>
                    })
                  }
                </tr>
              })
            }
          </tbody>
        </table>
        }
        
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    results: state.todos.results,
    price: state.todos.price,
    cost: state.todos.cost,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    submitResult: bindActionCreators(TodoActions.submitResult, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Choose)
