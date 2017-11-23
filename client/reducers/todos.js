import $ from 'jquery'
import { handleActions } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import ppf from './ppf';

const host = process.env.NODE_ENV !== 'development' ? 'http://localhost:8080' : 'https://mechanical-t.herokuapp.com'

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
  //   commulativeProfit: 9,
  // }],
  view: 'ethics',
  ethics: {},
  meanVariance: [[150, 144], [250, 144]],
  // view: 'instructions',
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
    let lastCommulativeProfit = 0
    
    if (lastResultIndex > 0 && lastResultIndex !== 5) {
      lastCommulativeProfit = state.results[lastResultIndex - 1].commulativeProfit;
    }
    const results = state.results.concat([{
      unitsOrdered,
      demand,
      unitsSold,
      unitsUnsold: unitsOrdered - demand >= 0 ? unitsOrdered - demand : 0,
      totalRevenue,
      totalCost,
      profitForThisRound,
      commulativeProfit: lastCommulativeProfit + profitForThisRound,
      time: new Date().toString(),
    }])
    if (results.length === 35) {

      const json = JSON.stringify({
        ...state,
        results,
      })
      fetch(`${host}/data`, {
        body: JSON.stringify({data: json}),
        method: 'POST',
      })
      $('#results').val(json)
      $('#results').closest('form').submit()
    }
    return {
      ...state,
      results,
      showSummary: true,
    }
  },
}, initialState)
