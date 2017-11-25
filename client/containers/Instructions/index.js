
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Markdown from 'react-markdown'
import Button from 'ui/Button'
import * as actions from 'actions/router'
import { priceCost } from 'reducers/todos'
import * as style from './style.css'

class Instructions extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0)
  }
  render () {
    const { todos, actions, children, goToGame, firstGame } = this.props
    const uniGraph = '![UniGraph](https://rawgithub.com/mechanicalt/mechanicalt.github.io/master/uniGraph.png "Graph")'
    const uniDemand = 'The distribution of demand is a single normal distribution with a means of 200 and a standard deviation of 12. Thus, the distributions of demand is unimodal. The probability of demand from 100 to 300 is described in the following graph (demand below 100 and above 300 is negligible):'
    const biGraph = '![Graph](https://rawgithub.com/mechanicalt/mechanicalt.github.io/master/graph.png "Graph")'
    const biDemand = 'The distribution of demand is an equal mixture of two normal distributions that have means of 150 and 250 and an equal standard deviation of 12. Thus, the distributions of demand is bimodal. The probability of demand from 100 to 300 is described in the following graph (demand below 100 and above 300 is negligible):'
    const firstGameUni = firstGame === 'uni'
    const source = `# Instructions
Thank you for participating. Make sure to read the instructions carefully as you will be paid more if you perform better. You will be playing two games where you can earn “experimental dollars”. Your total profit (the sum of the profits of every round) from the game will be divided by 5000 and rounded to the nearest $0.10, then added to your participation fee of $5 and paid to you in cash at the end of the session.

For both games, you are a retailer who sells a single item, the widget, over multiple rounds. In each round, you first order widgets from a (automated) supplier at a cost of $${priceCost.cost} per unit, and then sell widgets to your customers at a price of $${priceCost.price} per unit. Your task is to determine how many widgets to order each round to maximize your profit over all the rounds of the game. If you order too much you will incur costs associated with items unsold, and if you order too little you will be foregoing profits you otherwise could have collected. 

There will be 40 rounds in total (20 per each game). The first 5 rounds of each game are practice and do not count towards the cumulative profit which determines your performance pay. The process of each round will be as follows:

1. Choosing order quantity: At the start of each round you decide on an order quantity between 0 and 400. You do not know the customer demand, for that period, when you place the order.

2. Generation of customer demand: Once you place your order, customer demand will be randomly generated from a fixed distribution. 

  a) In the first game:
    
  ${firstGameUni ? uniDemand : biDemand}

  ${firstGameUni ? uniGraph : biGraph}

  b) In the second game:
            
  ${firstGameUni ? biDemand : uniDemand}

  ${firstGameUni ? biGraph : uniGraph}

In either game the demand for any one round is random and independent of the demand from earlier rounds. So a small or large additional demand in one round has no influence on whether additional demand is small or large in any other rounds.

3. Calculation of profit for the period: There are two different cases:

* If customer demand is less than (or equal to) your order quantity, then the quantity sold will be equal to customer demand 

  Profit = (Sales Price x Customer Demand) - (Purchase Price x Order Quantity)

* If customer demand is greater than the amount you ordered, then the quantity sold will be equal to your order quantity 

  Profit = (Sales Price x Order Quantity) - (Purchase Price x Order Quantity)

4. Clearance of leftover inventory: If your order quantity was greater than the demand, the remaining stock is disposed of at no cost. In other words, remaining inventory is worthless and is not carried over to following rounds.

5. Feedback information: At the end of each round, you will be provided with a summary of that round, such as your order quantity, customer demand and your profit for that round.

6. Number of rounds: Each game lasts for 20 rounds. The first 5 rounds are practice. After the first five rounds, our history will be cleared, and you will begin in round 1. Your total profit used for payment will be based on the profit over the subsequent 15 rounds.
  
  
Example 1: Customer demand is 60 units and you ordered 80 units so all of the demand can be filled.

Profit = (Sales Price x Customer Demand) - (Purchase Price x Order Quantity)

Profit = $${priceCost.price} x 60 units - $${priceCost.cost} x 80 units = $${(priceCost.price * 60) - (priceCost.cost * 80)} (experimental dollars)

Example 2: Customer demand is 60 units and you ordered 40 units, so only 40 units can be sold.

Profit = (Sales Price x Order Quantity) - (Purchase Price x Order Quantity)

Profit = $${priceCost.price} x 40 units - $${priceCost.cost} x 40 units = $${(priceCost.price * 40) - (priceCost.cost * 40)} (experimental dollars)`
    return (
      <div>
        <Markdown source={source} />
        <Button className={style.button} onClick={goToGame}>Proceed To Game</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  firstGame: state.todos.firstGame
})

function mapDispatchToProps (dispatch) {
  return {
    goToGame: () => dispatch(actions.goToGame())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instructions)
