import $ from 'jquery'
import { handleActions } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import ppf from './ppf';
import uniDemand from './uniDemand';

let uniqueUser = localStorage.getItem("uniqueUser")

if (!uniqueUser) {
  uniqueUser = Math.round(1000000000*Math.random())
  localStorage.setItem("uniqueUser", uniqueUser)
}

const uniqueId = Math.round(1000000000*Math.random())

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://mechanical-t.herokuapp.com'

const randomBool = () => Math.random() >= 0.5

console.log('host', host);
export const priceCost = randomBool() ? {
  price: 12,
  cost: 3
}
:
{
  price: 10,
  cost: 4,
};

const uniVal = randomBool();

const initialState = {
  ...priceCost,
  showSummary: false,
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
  uniResults: [],
  biResults: [],
  uniqueId,
  uniqueUser,
  view: 'ethics',
  ethics: {},
  meanVariance: [[150, 144], [250, 144]],
  uniMeanVariance: [200, 144],
  uni: uniVal,
  game: 1,
  attempt: 1,
  firstGame: uniVal ? 'uni' : 'bi',
  // view: 'instructions',
}

const getJson = (state)=>{
  return JSON.stringify(state)
}

const postResults = (state)=>{
  const json = JSON.stringify(state)
  return fetch(`${host}/data`, {
    body: JSON.stringify({data: json}),
    method: 'POST',
  })
}

export const getResultsName = (state)=>{
  return state.uni ? 'uniResults' : 'biResults';
}

export default handleActions({
  'AGREE_ETHICS' (state, action) {
    return {
      ...state,
      ethics: action.payload,
      view: 'instructions',
    }
  },
  'CHANGE_VIEW' (state, action) {
    const otherProps = action.changeUni ? {
      uni: !state.uni,
      showSummary: !state.showSummary,
    } : {}
    return {
      ...state,
      ...otherProps,
      view: action.payload,
      
    }
  },
  'TOGGLE_SUMMARY' (state, action) {
    return {
      ...state,
      showSummary: !state.showSummary,
    }
  },

  'SUBMIT_RESULT' (state, {payload}) {
    fetch(`${host}/data`, {
      method: 'GET',
    })
    const resultsName = getResultsName(state)
    const unitsOrdered = Number(payload);
    const demand = state.uni ? uniDemand(state.uniMeanVariance[0], state.uniMeanVariance[1]) : ppf(state.meanVariance[0], state.meanVariance[1]);
    const unitsSold = unitsOrdered - demand >= 0 ? demand : unitsOrdered;
    const totalRevenue = state.price * unitsSold;
    const totalCost = unitsOrdered*state.cost;
    const profitForThisRound = totalRevenue - totalCost;
    const lastResultIndex = state[resultsName].length
    let lastcumulativeProfit = 0

    if (lastResultIndex > 0 && lastResultIndex !== 5) {
      lastcumulativeProfit = state[resultsName][lastResultIndex - 1].cumulativeProfit;
    }
    const results = state[resultsName].concat([{
      unitsOrdered,
      demand,
      unitsSold,
      unitsUnsold: unitsOrdered - demand >= 0 ? unitsOrdered - demand : 0,
      totalRevenue,
      totalCost,
      profitForThisRound,
      cumulativeProfit: lastcumulativeProfit + profitForThisRound,
      time: new Date().toString(),
    }])
    const nextState = {
      ...state,
      [resultsName]: results,
      showSummary: true,
      attempt: results.length,
    }
    $('#results').val(JSON.stringify(nextState))
    if (results.length % 5 === 0) {
      postResults(nextState,)
    }
    return nextState;
  },
}, initialState)
