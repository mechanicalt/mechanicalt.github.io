// @flow

export const getTodos = (state) => state.todos
export const getCurrentResults = (state) => {
  return getTodos(state).results
}
