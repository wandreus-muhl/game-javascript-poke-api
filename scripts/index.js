let winnedRounds = 0
let gameScreen = document.getElementById('game-screen')

window.onload = async() => {
  await gameRoundGenerator(winnedRounds)
}


async function getPokemons() {
  const result = await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')).json()
  const pokemonList = result.results
  return pokemonList
}

async function getRandomPokemons() {
  const result = []
  const pokemonsList = await getPokemons()

  let iterator = 0
  do {
    const randomNumber = Math.floor(Math.random() * pokemonsList.length)
    if(!result.includes(pokemonsList[randomNumber])){
      result.push(pokemonsList[randomNumber])
      iterator++
    }
  } while(iterator < 4)

  return result
}

async function gameRoundGenerator(currentScore) {
  generateScore(currentScore)

  const roundPokemons = await getRandomPokemons()
  const pokemon = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${roundPokemons[0].name}`)).json()
  const winner = roundPokemons[0]

  
  const pokemonImage = await (await fetch(pokemon.sprites.front_default)).blob()
  const pokemonImageElement = document.createElement('img')
  pokemonImageElement.id = 'test'
  pokemonImageElement.src = URL.createObjectURL(pokemonImage)
  
  let firstOption = document.createElement('button')
  firstOption.innerHTML = setRoundOptions(roundPokemons)
  firstOption.addEventListener('click', () => endRound(winner.name))
  
  let secondOption = document.createElement('button')
  secondOption.innerHTML = setRoundOptions(roundPokemons)
  secondOption.addEventListener('click', () => endRound(winner.name))
  
  let thirdOption = document.createElement('button')
  thirdOption.innerHTML = setRoundOptions(roundPokemons)
  thirdOption.addEventListener('click', () => endRound(winner.name))
  
  let fourthOption = document.createElement('button')
  fourthOption.innerHTML = setRoundOptions(roundPokemons)
  fourthOption.addEventListener('click', () => endRound(winner.name))
  
  gameScreen.innerHTML = ''
  gameScreen.appendChild(pokemonImageElement)
  gameScreen.appendChild(firstOption)
  gameScreen.appendChild(secondOption)
  gameScreen.appendChild(thirdOption)
  gameScreen.appendChild(fourthOption)
}


function setRoundOptions(payload) {
  randomNumber = (Math.floor(Math.random() * payload.length))
  const result = payload[randomNumber].name
  payload.splice(randomNumber, 1)

  return result
}

async function endRound(winner) {
  if(event.target.innerHTML === winner) {
    document.getElementById('test').className = 'right-answer'
    winnedRounds++
  } else {
    winnedRounds = 0
    if(confirm(`You lose :(\n The right answer was ${winner}...\nWanna try again?`)) {
      return location.reload()
    } else window.close()  
  }
  sleep(2500).then(async() => {
    await gameRoundGenerator(winnedRounds)
  })
}

function generateScore(currentScore) {
  const record = localStorage.getItem('record') || 0

  if(currentScore > record) {
    localStorage.setItem('record', currentScore)
    document.getElementById('record').innerHTML = `Record: ${currentScore}`
  } else {
    document.getElementById('record').innerHTML = `Record: ${record}`
  }
  document.getElementById('current-score').innerHTML = `Current Score: ${currentScore}`
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
