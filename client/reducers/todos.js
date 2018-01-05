import $ from 'jquery'
import { handleActions } from 'redux-actions'
import fetch from 'isomorphic-fetch'
// import ppf from './ppf'
// import uniDemand from './uniDemand'
import qs from 'query-string'
import uniformDemand from './uniformDemand'
import triangleDemand from './triangleDemand'

const iframeUrl = document.location.search
const params = qs.parse(iframeUrl)
$('#assignmentId').val(params.assignmentId)
let uniqueUser = localStorage.getItem('uniqueUser')

if (!uniqueUser) {
  uniqueUser = Math.round(1000000000 * Math.random())
  localStorage.setItem('uniqueUser', uniqueUser)
}

const uniqueId = Math.round(1000000000 * Math.random())

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://mechanical-t.herokuapp.com'

const randomBool = () => Math.random() >= 0.5

const randomChoice = Math.random()

const getCost = () => {
  return randomChoice >= 0.5 ? 3 : 9
  // if (randomChoice < 0.2) {
  //   return 3
  // }
  // if (randomChoice < 0.4) {
  //   return 4
  // }
  // if (randomChoice < 0.6) {
  //   return 6
  // }
  // if (randomChoice < 0.8) {
  //   return 8
  // }
  // if (randomChoice < 1) {
  //   return 9
  // }
}

export const divisor = randomChoice >= 0.5 ? 50000 : 25000

const getDistribution = () => {
  return randomBool() ? 'uni' : 'bi'
  // const thirds = 1 / 3
  // const rand = Math.random()
  // if (rand < thirds) {
  //   return 'uni'
  // }
  // if (rand < (2 * thirds)) {
  //   return 'bi'
  // }
  // return 'bay'
}

export const demandBoost = randomChoice >= 0.5 ? 0 : 500

export const demandBetween = demandBoost ? '500 and 1500' : '0 and 1000'

export const priceCost = {
  price: 12,
  cost: getCost(),
  divisor: divisor,
}

const initialState = {
  ...priceCost,
  assignmentId: params.assignmentId,
  showSummary: false,
  distribution: getDistribution(),
  // distribution: 'bi',
  // showSummary: true,
  // uniResults: [{
  //   unitsOrdered: 1,
  //   demand: 87,
  //   unitsSold: 1,
  //   unitsUnsold: 0,
  //   totalRevenue: 12,
  //   totalCost: 3,
  //   profitForThisRound: 9,
  //   cumulativeProfit: 9,
  // }],
  demandBoost: demandBoost,
  results: [],
  uniqueId,
  uniqueUser,
  view: 'ethics',
  ethics: {},
  game: 1,
  attempt: 0,
  // view: 'game',
  // view: 'instructions',
  // view: 'riskAdverse',
  // view: 'testUnderstanding',
}

const getJson = (state) => {
  return JSON.stringify(state)
}

export const postResults = (state) => {
  const json = JSON.stringify(state)
  return fetch(`${host}/data`, {
    body: JSON.stringify({ data: json }),
    method: 'POST'
  })
}
const getDemand = (state) => {
  return ((state.distribution === 'uni' ? uniformDemand() : triangleDemand()) + state.demandBoost)
}

export default handleActions({
  'AGREE_ETHICS' (state, action) {
    return {
      ...state,
      ethics: action.payload,
      view: 'riskAdverse'
    }
  },
  'RISK_ADVERSE' (state, action) {
    return {
      ...state,
      riskAdverse: action.payload,
      view: 'instructions'
    }
  },
  'TEST_UNDERSTANDING' (state, action) {
    return {
      ...state,
      testUnderstandingAttempts: action.payload,
      view: 'choose'
    }
  },
  'CHANGE_VIEW' (state, action) {
    const otherProps = action.changeUni ? {
      showSummary: !state.showSummary
    } : {}
    return {
      ...state,
      ...otherProps,
      view: action.payload

    }
  },
  'TOGGLE_SUMMARY' (state, action) {
    return {
      ...state,
      showSummary: !state.showSummary
    }
  },

  'SUBMIT_RESULT' (state, { payload }) {
    fetch(`${host}/data`, {
      method: 'GET'
    })
    const unitsOrdered = Number(payload)
    const demand = getDemand(state)
    const unitsSold = unitsOrdered - demand >= 0 ? demand : unitsOrdered
    const totalRevenue = state.price * unitsSold
    const totalCost = unitsOrdered * state.cost
    const profitForThisRound = totalRevenue - totalCost
    const lastResultIndex = state.results.length
    let lastcumulativeProfit = 0

    if (lastResultIndex > 0 && lastResultIndex !== 5) {
      lastcumulativeProfit = state.results[lastResultIndex - 1].cumulativeProfit
    }
    const results = state.results.concat([{
      unitsOrdered,
      demand,
      unitsSold,
      unitsUnsold: unitsOrdered - demand >= 0 ? unitsOrdered - demand : 0,
      totalRevenue,
      totalCost,
      profitForThisRound,
      cumulativeProfit: lastcumulativeProfit + profitForThisRound,
      time: new Date().toString()
    }])
    const nextState = {
      ...state,
      results: results,
      showSummary: true,
      attempt: state.attempt + 1,
    }
    $('#results').val(JSON.stringify(nextState))
    if (results.length % 35 === 0) {
      postResults(nextState)
    }
    return nextState
  }
}, initialState)
