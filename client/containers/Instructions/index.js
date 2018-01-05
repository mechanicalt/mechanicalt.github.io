
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Markdown from 'react-markdown'
import Button from 'ui/Button'
import * as actions from 'actions/router'
import { priceCost, demandBoost, demandBetween, divisor } from 'reducers/todos'
import * as style from './style.css'
import * as u from 'utils'
class Instructions extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0)
  }
  getDemand = () => {
    const uniDemand = `There is a 1/1000 chance that demand in any round will be any one of the integers from ${demandBetween}.  That means that there is an equal chance that demand for the widget will be equal to any number from ${demandBetween}. The following figure illustrates the probability of the randomly generated demand in each round:

  ![Graph](${u[demandBoost ? 'uniGraphSrcHigh' : 'uniGraphSrcLow']} "Graph")
`
    const biDemand = `The distribution of demand (i.e. the probability of a demand value occurring) depends on the weather, which is equally likely to be good or bad. If the weather is poor, then demand ranges from ${1 + demandBoost} - ${500 + demandBoost}. The most likely value of demand is ${250 + demandBoost}, and the probability of demand lowers, at a constant rate, as the values of demand moves away from the peak towards either ${1 + demandBoost} and ${500 + demandBoost}. Similarly, if the weather is good, then demand ranges from ${500 + demandBoost} - ${1000 + demandBoost}. The most likely value of demand is ${750 + demandBoost}, and the probability of demand lowers, at a constant rate, as the values of demand moves away from the peak towards either ${500 + demandBoost} and ${1000 + demandBoost}. The following figure illustrates the probability of the randomly generated demand in each round:

![Graph](${u[demandBoost ? 'biGraphSrcHigh' : 'biGraphSrcLow']} "Graph")
`

    const bayDemand = `The distribution of demand (i.e. the probability of a demand value occurring) will be drawn from one of two symmetric triangular distributions: a triangle with high demand or a triangle with low demand. For each triangle, the highest probability of a realized demand value is at the top of the triangle, and the probability of arrivals decreases as the values of demand increase away from the peak towards upper and lower bounds of the triangle. 
    The first triangle distribution has a lower bound at ${0 + demandBoost} units of demand, a peak (mode) at ${250 + demandBoost} units of demand, and an upper bound of ${500 + demandBoost} units. The following figure illustrates the probability of the randomly generated demand in each round:
![Graph](${u[demandBoost ? 'bayGraph1SrcHigh' : 'bayGraph1SrcLow']} "Graph")    
    The second triangle has a lower bound at ${500 + demandBoost} units of demand, a peak (mode) at ${750 + demandBoost} units of demand, and an upper bound of ${1000 + demandBoost} units. The following figure illustrates the probability of the randomly generated demand in each round:
![Graph](${u[demandBoost ? 'bayGraph2SrcHigh' : 'bayGraph2SrcLow']} "Graph")
    Whether demand is drawn from triangle 1 (low demand) or triangle 2 (high demand) is equally likely, i.e. a 50% chance demand is randomly drawn from triangle 1 and a 50% chance demand is randomly drawn from triangle 
`
    switch (this.props.distribution) {
      case 'uni':
        return uniDemand
      case 'bi':
        return biDemand
      default:
        return bayDemand
    }
  }
  render () {
    const { todos, actions, children, goToGame } = this.props
    // const uniGraph = `![UniGraph](${u.uniGraphSrc} "Graph")`
    // const uniDemand = 'The distribution of demand is a single normal distribution with a means of 200 and a standard deviation of 12. Thus, the distributions of demand is unimodal. The probability of demand from 100 to 300 is described in the following graph (demand below 100 and above 300 is negligible):'
    // const biGraph = `![Graph](${u.biGraphSrc} "Graph")`
    // const biDemand = 'The distribution of demand is an equal mixture of two normal distributions that have means of 150 and 250 and an equal standard deviation of 12. Thus, the distributions of demand is bimodal. The probability of demand from 100 to 300 is described in the following graph (demand below 100 and above 300 is negligible):'
    
    const source = `# Instructions
    
Thank you for participating. Make sure to read the instructions carefully as you will be paid more if you perform better. You will be playing a game where you can earn “experimental dollars”. Your total profit (the sum of the profits of every round) from the game will be divided by ${divisor}, then added to your participation fee of $0.50 and paid to you at the end of the session.

In the game, you are a retailer selling a single item, the widget, over multiple rounds. In each round, you first order widgets from a (automated) supplier at a cost of $${priceCost.cost} per unit, and then sell widgets to your customers at a price of $12 per unit. Your task is to determine how many widgets to order each round to maximize your profit over all the rounds of the game. If you order too much, you still incur the cost of $${priceCost.cost} associated with each unsold item, and if you order too little, you forego profits you otherwise could have collected.

There will be 35 rounds in total. The first 5 rounds are practice and do not count towards the cumulative profit which determines your bonus pay. The process of each round will be as follows:

1. Choosing order quantity: At the start of each round you decide on an order quantity between ${demandBetween}. You do not know the customer demand when you place the order.

2. Generation of customer demand: Once you place your order, customer demand will be randomly generated from a fixed (unchanging) distribution between ${demandBetween} units. The randomly generated demand combined with the amount that you order will determine your profit for the round.
${this.getDemand()}
  Remember, the demand in any one round is random and independent of the demand from earlier rounds. So a small or large demand in one round has no influence on whether demand is small or large in any other rounds.

3. Calculation of profit for the period: There are two different cases:

  If customer demand is less than (or equal to) your order quantity, then the quantity sold will be equal to customer demand

  Profit = (Sales Price x Customer Demand) - (Purchase Price x Order Quantity)

  If customer demand is greater than the amount you ordered, then the quantity sold will be equal to your order quantity

  Profit = (Sales Price x Order Quantity) - (Purchase Price x Order Quantity)

4. Clearance of leftover inventory: If your order quantity was greater than the demand, the remaining stock is disposed of at no cost. In other words, remaining inventory is worthless and is not carried over to following rounds.

5. Feedback information: At the end of each round, you will be provided with a summary of that round, such as your order quantity, customer demand and your profit for that round.

6. Number of rounds: There will be 35 rounds. The first 5 rounds are practice. After the first 5 rounds, your history will be cleared, and you will begin in round 1. Your total profit used for payment will be based on the profit over the subsequent 30 rounds.

Example 1: Customer demand is 600 units and you ordered 800 units so all of the demand can be filled.

Profit = (Sales Price x Customer Demand) - (Purchase Price x Order Quantity)

Profit = $12 x 600 units - $3 x 800 units = $4800 (experimental dollars)

Example 2: Customer demand is 600 units and you ordered 400 units, so only 400 units can be sold.

Profit = (Sales Price x Order Quantity) - (Purchase Price x Order Quantity)

Profit = $12 x 400 units - $3 x 400 units = $3600 (experimental dollars)
  `
    return (
      <div className={style.instructions}>
        <Markdown source={source} />
        <Button className={style.button} onClick={goToGame}>Proceed To Game</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  distribution: state.todos.distribution,
  testUnderstandingAttempts: state.todos.testUnderstandingAttempts,
})

function mapDispatchToProps (dispatch, {testUnderstandingAttempts}) {
  return {
    goToGame: () => (testUnderstandingAttempts ? dispatch(actions.goToGame()) : dispatch(actions.goToTestUnderstanding()))
  }
}

export default _.flowRight([
  connect(mapStateToProps),
  connect(null, mapDispatchToProps)
])(Instructions)
