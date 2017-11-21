import gaussian from 'gaussian'

const lowModal = gaussian(150, 144);
const highModal = gaussian(250, 144);

let probabilities = {}
let i = 0
while(i <= 399){
  probabilities[i] = (lowModal.cdf(i) + highModal.cdf(i)) / 2
  i++
}

export default ()=>{
  const p = Math.random();
  let j = 0
  let v = null
  let previousProbability = 0
  while(j <= 399 || !v){
    if (probabilities[j] <= p) {
      v = j
    }
    j++
  }
  return Math.round(v / 4)
}