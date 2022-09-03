import './style.css'

const app = document.querySelector('#app')

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
} // rowsDivs()

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
} // colsDivs()

const titleH1 = document.createElement('h1')
titleH1.innerText = 'Fifteen Puzzle'
container.appendChild(titleH1)

const boardDiv = document.createElement('div')
boardDiv.className = 'board'
container.appendChild(boardDiv)

// CREATE ARRAY OF NUMBERS
const integer = Array.from({ length: 15 }, (_, i) => i + 1)
integer.push(' ') // add the empty 

// SHUFFLE THE ARRAY 
integer.sort(() => {
  return Math.random() - 0.5;
})

// INIT numbers array of number object
const numbers = []
integer.forEach((integer, i) => {

  const number = {}
  number.button = document.createElement('button')

  if (i <= 3) {
    number.row = 1
    number.col = i + 1
  } else if (i <= 7) {
    number.row = 2
    number.col = i - 3
  } else if (i <= 11) {
    number.row = 3
    number.col = i - 7
  } else if (i <= 15) {
    number.row = 4
    number.col = i - 11
  }

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

// GAME LOGIC
numbers.forEach(number => {

  number.button.addEventListener('mousedown', () => {

    const clickedNumber = number
    const emptyNumber = numbers.find(({ value }) => value === ' ')

    const indexEmpty = numbers.findIndex(number => number.value === ' ')
    const indexClicked = numbers.findIndex(number => number.value === clickedNumber.value)

    const indexDiff = indexEmpty - indexClicked
    const indexAbs = Math.abs(indexDiff)

    const indexesToSwap = []

    indexesToSwap.push(indexEmpty)
    indexesToSwap.push(indexClicked)

    // CLICKED EMPTY
    if (indexClicked == indexEmpty) {

      clickedNumber.button.classList.add('cannotmove')
      setTimeout(() => {
        clickedNumber.button.classList.remove('cannotmove')
      }, 500);

    }

    // MOVE NEAREST
    else if (indexAbs == 1 && clickedNumber.row == emptyNumber.row ||
      indexAbs == 4 && clickedNumber.col == emptyNumber.col) {

      swapNumberValue(numbers, clickedNumber, emptyNumber)
    }

    // MOVE ON ROWS
    else if (indexDiff > 1 && clickedNumber.row == emptyNumber.row) {

      for (let i = 1; i < indexAbs; i++) {
        indexesToSwap.push(indexClicked + i)
      }

      indexesToSwap.sort((a, b) => b - a)
      indexesToSwap.pop()

      indexesToSwap.forEach(index => {
        swapNumberValue(numbers, numbers[index - 1], numbers[index])
      })

    } else if (indexDiff < 1 && clickedNumber.row == emptyNumber.row) {

      for (let i = 1; i < indexAbs; i++) {
        indexesToSwap.push(indexEmpty + i)
      }

      indexesToSwap.sort((a, b) => a - b)
      indexesToSwap.pop()

      indexesToSwap.forEach(index => {
        swapNumberValue(numbers, numbers[index], numbers[index + 1])
      })

    }

    // MOVE ON COLUMNS
    else if (indexDiff > 1 && clickedNumber.col == emptyNumber.col) {

      for (let i = 0; i < indexAbs; i = i + 4) {
        indexesToSwap.push(indexClicked + i)
      }

      indexesToSwap.sort((a, b) => b - a)
      indexesToSwap.pop()
      indexesToSwap.pop()

      indexesToSwap.forEach(index => {
        swapNumberValue(numbers, numbers[index - 4], numbers[index])
      })

    } else if (indexDiff < 1 && clickedNumber.col == emptyNumber.col) {

      for (let i = 0; i < indexAbs; i = i + 4) {
        indexesToSwap.push(indexEmpty + i)
      }

      indexesToSwap.sort((a, b) => a - b)
      indexesToSwap.pop()
      indexesToSwap.shift()

      indexesToSwap.forEach(index => {
        swapNumberValue(numbers, numbers[index], numbers[index + 4])
      })

    }
    
    // CANNOT MOVE
    else {

      clickedNumber.button.classList.add('cannotmove')
      setTimeout(() => {
        clickedNumber.button.classList.remove('cannotmove')
      }, 500);

    }




    console.table(numbers)

  })

  

})


function swapNumberValue(numbers, number1, number2) {

  // Find the index of item that contains value1
  const indexOfValue1 = numbers.findIndex(number => number.value === number1.value)
  // and 2
  const indexOfValue2 = numbers.findIndex(number => number.value === number2.value)

  // Swap the values
  // console.table(numbers);
  const tempValue = numbers[indexOfValue1].value

  number1.value = number2.value
  number2.value = tempValue

  const tempClass = numbers[indexOfValue1].button.className

  number1.button.className = number2.button.className
  number2.button.className = tempClass

  const tempInnerText = numbers[indexOfValue1].button.innerText

  number1.button.innerText = number2.button.innerText
  number2.button.innerText = tempInnerText

  // if (number1.value < number2.value) {
  //   numbers[indexOfValue2].button.classList.add('canmove')
  //   setTimeout(() => {
  //     numbers[indexOfValue2].button.classList.remove('canmove')
  //   }, 250);
  // } else {
  //   numbers[indexOfValue1].button.classList.add('canmove')
  //   setTimeout(() => {
  //     numbers[indexOfValue1].button.classList.remove('canmove')
  //   }, 250);
  // }

  return numbers

}


