import './style.css'

const app = document.querySelector('#app')

// const titleH1 = document.createElement('h1')
// titleH1.innerText = 'Fifteen Puzzle'
// app.appendChild(titleH1)

const rowsDivs = () => {
  const rowsNumbers = Array.from({ length: 4 }, (_, i) => i + 1)
  const rowsNumbersContainer = document.createElement('div')
  rowsNumbersContainer.className = 'rowsNumbersContainer'
  app.appendChild(rowsNumbersContainer)
  rowsNumbers.forEach((rownumber) => {
    const rownumberDiv = document.createElement('div')
    rownumberDiv.innerText = rownumber
    rownumberDiv.className = 'rowNumber'
    rowsNumbersContainer.appendChild(rownumberDiv)
  })
}

// rowsDivs()

const container = document.createElement('div')
container.className = 'container'
app.appendChild(container)

const colsDivs = () => {
  const colsNumbers = Array.from({ length: 4 }, (_, i) => i + 1)
  const colsNumbersContainer = document.createElement('div')
  colsNumbersContainer.className = 'colsNumbersContainer'
  container.appendChild(colsNumbersContainer)
  colsNumbers.forEach((colnumber) => {
    const colnumberDiv = document.createElement('div')
    colnumberDiv.innerText = colnumber
    colnumberDiv.className = 'colNumber'
    colsNumbersContainer.appendChild(colnumberDiv)
  })
}

// colsDivs()

const boardDiv = document.createElement('div')
boardDiv.className = 'board'
container.appendChild(boardDiv)

// CREATE ARRAY OF NUMBERS
const integer = Array.from({ length: 15 }, (_, i) => i + 1)
integer.push(' ') // add the empty 

// SHUFFLE
integer.sort(() => {
  return Math.random() - 0.5;
})

// INIT numbers array of number object
const numbers = []

// DOM POPULATION
integer.forEach((integer, i) => {

  const number = {}
  number.button = document.createElement('button')

  // if (i <= 3) {
  //   number.row = 1
  //   number.col = i + 1
  // } else if (i <= 7) {
  //   number.row = 2
  //   number.col = i - 3
  // } else if (i <= 11) {
  //   number.row = 3
  //   number.col = i - 7
  // } else if (i <= 15) {
  //   number.row = 4
  //   number.col = i - 11
  // }

  if (integer == ' ') {

    number.value = ' '
    number.button.className = 'empty'

  } else {

    number.value = integer
    number.button.className = 'number'

  }

  number.button.innerText = number.value
  boardDiv.appendChild(number.button)
  numbers.push(number)

})


numbers.forEach(number => {
  number.button.addEventListener('mousedown', () => {

    const clickedNumber = number

    const indexEmpty = numbers.findIndex(number => number.value === ' ')
    const indexClicked = numbers.findIndex(number => number.value === clickedNumber.value )
    
    // const empty = numbers.find(({ value }) => value === ' ')

    let indexDiff = indexEmpty - indexClicked

    if (Math.abs(indexDiff) == 1 || Math.abs(indexDiff) == 4) {

      console.log(`move right ${indexDiff}`)

      // LOGIC
      numbers[indexEmpty].value = numbers[indexEmpty - indexDiff].value
      numbers[indexEmpty - indexDiff].value = ' '

      // DOM
      numbers[indexEmpty].button.innerText = numbers[indexEmpty - indexDiff].button.innerText
      numbers[indexEmpty].button.className = 'number' 
      numbers[indexEmpty - indexDiff].button.innerText = ' '
      numbers[indexEmpty - indexDiff].button.className = 'empty'

      numbers[indexEmpty].button.classList.add('canmove')        
      setTimeout(() => {
        numbers[indexEmpty].button.classList.remove('canmove')        
      }, 250);

      console.table(numbers)

    } else {

      clickedNumber.button.classList.add('cannotmove')
      setTimeout(() => {
        clickedNumber.button.classList.remove('cannotmove')
      }, 500);


    }



  })
})

console.table(numbers);


