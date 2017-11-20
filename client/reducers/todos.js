
import { handleActions } from 'redux-actions'

const initialState = {
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
  price: 12,
  cost: 3,
  view: 'instructions',
}

export default handleActions({
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
    const unitsOrdered = Number(payload);
    const demand = Math.round(100 * Math.random())
    const unitsSold = unitsOrdered - demand >= 0 ? demand : unitsOrdered;
    const totalRevenue = state.price * unitsSold;
    const totalCost = unitsOrdered*state.cost;
    const profitForThisRound = totalRevenue - totalCost;
    const lastResultIndex = state.results.length
    let lastCommulativeProfit = 0
    if (lastResultIndex > 0) {
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
    }])

    return {
      ...state,
      results,
      showSummary: true,
    }
  },
}, initialState)
