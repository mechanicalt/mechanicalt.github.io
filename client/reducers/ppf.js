import gaussian from 'gaussian'

let probabilities

const getProbabilities = ([mean1, variance1], [mean2, variance2]) => {
  const lowModal = gaussian(mean1, variance1)
  const highModal = gaussian(mean2, variance2)

  let i = 0
  probabilities = {}
  while (i <= 400) {
    probabilities[i] = (lowModal.cdf(i) + highModal.cdf(i)) / 2
    i++
  }
}

export default (group1, group2) => {
  if (!probabilities) {
    getProbabilities(group1, group2)
  }
  const p = Math.random()
  let j = 0
  let v = null
  while (j <= 400 || !v) {
    if (probabilities[j] <= p) {
      v = j
    }
    j++
  }
  return v
}
