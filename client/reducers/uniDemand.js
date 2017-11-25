import gaussian from 'gaussian'

let distribution

export default (mean, variance) => {
  if (!distribution) {
    distribution = gaussian(mean, variance)
  }
  return Math.round(distribution.ppf(Math.random()))
}
