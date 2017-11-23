
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Markdown from 'react-markdown'
import Button from 'ui/Button'
import * as actions from 'actions/router'
import {priceCost} from 'reducers/todos'
import * as style from './style.css'

const source = `
  # Instructions
  Thank you for participating. Make sure to read the instructions carefully as you will be paid more if you perform better. You will be playing a game where you can earn “experimental dollars”. Your total profit (the sum of the profits of every round) from the game will be divided by 1000 and rounded to the nearest $0.10, then added to your participation fee of $5 and paid
  to you in cash at the end of the session.
  
  You are a retailer who sells a single item, the widget, over multiple rounds. In each round of the game, you first order widgets from a (automated) supplier at a cost of $3 per unit, and then sell widgets to your customers at a price of $12 per unit. Your task is to determine how many widgets to order each round to maximize your profit over all the rounds of the game. If you order too much you will incur costs associated with items unsold, and if you order too little you will be foregoing profits you otherwise could have collected. 
  
  The process of each round will be as follows:
  
  1. Choosing order quantity: At the start of each round you decide on an order quantity between 0 and 100. You do not know the customer demand, for that period, when you place the order.
  
  2. Generation of customer demand: Once you place your order, customer demand will be randomly generated from a fixed distribution. The distribution of demand is an equal mixture of two normal distributions that have means of 150 and 250 and an equal standard deviation of 12. Thus, the distributions of demand is bimodal. The probability of demand from 100 to 300 is described in the following graph:
  
  ![Graph](https://rawgithub.com/mechanicalt/mechanicalt.github.io/master/graph.png "Graph")

  The demand for any one round is random and independent of the demand from earlier rounds. So a small or large additional demand in one round has no influence on whether additional demand is small or large in any other rounds.
  
  3. Calculation of profit for the period: There are two different cases:

  * If customer demand is less than (or equal to) your order quantity, then the quantity sold will be equal to customer demand 
  
    Profit = (Sales Price x Customer Demand) - (Purchase Price x Order Quantity)
  
  * If customer demand is greater than the amount you ordered, then the quantity sold will be equal to your order quantity 
  
    Profit = (Sales Price x Order Quantity) - (Purchase Price x Order Quantity)
  
  4. Clearance of leftover inventory: If your order quantity was greater than the demand, the remaining stock is disposed of at no cost. In other words, remaining inventory is worthless and is not carried over to following rounds.
  
  5. Feedback information: At the end of each round, you will be provided with a summary of that round, such as your order quantity, customer demand and your profit for that round.
  
  6. Number of rounds: The game lasts for 35 rounds. The first 5 rounds are practice. After the first five rounds, our history will be cleared, and you will begin in round 1. Your total profit used for payment will be based on the profit over the subsequent 30 rounds.
  
  
Example 1: Customer demand is 60 units and you ordered 80 units so all of the demand can be filled.

Profit = (Sales Price x Customer Demand) - (Purchase Price x Order Quantity)

Profit = $${priceCost.price} x 60 units - $${priceCost.cost} x 80 units = $${(priceCost.price * 60) - (priceCost.cost * 80)} (experimental dollars)

Example 2: Customer demand is 60 units and you ordered 40 units, so only 40 units can be sold.

Profit = (Sales Price x Order Quantity) - (Purchase Price x Order Quantity)

Profit = $${priceCost.price} x 40 units - $${priceCost.cost} x 40 units = $${(priceCost.price * 40) - (priceCost.cost * 40)} (experimental dollars)

`


class Instructions extends Component {
  render() {
    const { todos, actions, children, goToGame } = this.props
    return (
      <div>
        <Markdown source={source} />
        <Button className={style.button} onClick={goToGame}>Proceed To Game</Button>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    goToGame: ()=>dispatch(actions.goToGame()),
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Instructions)
