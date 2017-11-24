import $ from 'jquery'
import { handleActions } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import ppf from './ppf';

let uniqueUser = localStorage.getItem("uniqueUser")

if (!uniqueUser) {
  uniqueUser = Math.round(1000000000*Math.random())
  localStorage.setItem("uniqueUser", uniqueUser)
}

const uniqueId = Math.round(1000000000*Math.random())

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://mechanical-t.herokuapp.com'

console.log('host', host);
export const priceCost = Math.random() >= 0.5 ? {
  price: 12,
  cost: 3
}
:
{
  price: 10,
  cost: 4,
};

const initialState = {
  ...priceCost,
  showSummary: false,
  results: [],
  // showSummary: true,
  // results: [{
  //   unitsOrdered: 1,
  //   demand: 87,
  //   unitsSold: 1,
  //   unitsUnsold: 0,
  //   totalRevenue: 12,
  //   totalCost: 3,
  //   profitForThisRound: 9,
  //   cumulativeProfit: 9,
  // }],
  uniqueId,
  uniqueUser,
  view: 'ethics',
  ethics: {},
  meanVariance: [[150, 144], [250, 144]],
  // view: 'results',
}

const getJson = (state, results, attempt)=>{
  const json = JSON.stringify({
    ...state,
    results,
    attempt,
  })
}

const postResults = (state, results, attempt)=>{
  const json = getJson(state, results, attempt)
  return fetch(`${host}/data`, {
    body: JSON.stringify({data: json}),
    method: 'POST',
  })
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
    return {
      ...state,
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
    const unitsOrdered = Number(payload);
    const demand = ppf(state.meanVariance[0], state.meanVariance[1]);
    const unitsSold = unitsOrdered - demand >= 0 ? demand : unitsOrdered;
    const totalRevenue = state.price * unitsSold;
    const totalCost = unitsOrdered*state.cost;
    const profitForThisRound = totalRevenue - totalCost;
    const lastResultIndex = state.results.length
    let lastcumulativeProfit = 0
    if (lastResultIndex > 0 && lastResultIndex !== 5) {
      lastcumulativeProfit = state.results[lastResultIndex - 1].cumulativeProfit;
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
      time: new Date().toString(),
    }])
    if (results.length % 5 === 0) {
      postResults(state, results, results.length)
    }
    let view = 'game'
    if (results.length === 35) {
      view = 'results'
      $('#results').val(getJson(state, results, results.length))
    }
    return {
      ...state,
      view,
      results,
      showSummary: true,
    }
  },
}, initialState)
