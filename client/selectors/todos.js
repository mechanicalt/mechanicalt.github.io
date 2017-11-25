import * as reducers from 'reducers/todos'

export const getTodos = (state) => state.todos
export const getResultsName = (state) => reducers.getResultsName(getTodos(state))
export const getCurrentResults = (state) => {
  const resultsName = getResultsName(state)
  console.log('resultsName', resultsName)
  return getTodos(state)[resultsName]
}
