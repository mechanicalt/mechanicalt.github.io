
import { createAction } from 'redux-actions'

export const toggleSummary = createAction('TOGGLE_SUMMARY')
export const submitResult = createAction('SUBMIT_RESULT')
export const editTodo = createAction('edit todo')
export const completeTodo = createAction('complete todo')
export const completeAll = createAction('complete all')
export const clearCompleted = createAction('clear complete')
