export const goToGame = (changeUni) => ({
  type: 'CHANGE_VIEW',
  payload: 'game',
  changeUni
})

export const goToResults = () => ({
  type: 'CHANGE_VIEW',
  payload: 'results'
})

export const goToInstructions = () => ({
  type: 'CHANGE_VIEW',
  payload: 'instructions'
})
