import './style.css'
import { uniqueNamesGenerator, names } from 'unique-names-generator';

const app = document.querySelector('#app')
const DEBUG_LEADERBOARD = false

function newGame() {

  const container = document.createElement('div')
  container.className = 'container'
  app.appendChild(container)

  const titleH1 = document.createElement('h1')
  titleH1.innerText = 'Fifteen Puzzle'
  container.appendChild(titleH1)

  const boardDiv = document.createElement('div')
  boardDiv.className = 'board'
  container.appendChild(boardDiv)

  let moves = 0
  let seconds = 0

  // UI
  const ui = document.createElement('div')
  ui.className = 'ui'
  container.appendChild(ui)

  // SECONDS COUNTER
  const timerDisplay = document.createElement('p')
  timerDisplay.innerText = `${seconds} seconds`
  timerDisplay.style.float = 'left'
  ui.appendChild(timerDisplay)

  let timer = setInterval(() => {
    seconds += 1;
    timerDisplay.innerText = `${seconds} seconds`
  }, 1000)

  // MOVES COUNTER
  const movesNum = document.createElement('p')
  movesNum.innerText = `${moves} moves`
  movesNum.style.float = 'right'
  ui.appendChild(movesNum)

  // CREATE ARRAY OF NUMBERS
  const integer = Array.from({ length: 15 }, (_, i) => i + 1)
  integer.push(' ') // add the empty 

  // SHUFFLE THE ARRAY
  if (DEBUG_LEADERBOARD == false) {
    integer.sort(() => {
      return Math.random() - 0.5;
    })
  }

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
        moves++

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

        moves++

      } else if (indexDiff < 1 && clickedNumber.row == emptyNumber.row) {

        for (let i = 1; i < indexAbs; i++) {
          indexesToSwap.push(indexEmpty + i)
        }

        indexesToSwap.sort((a, b) => a - b)
        indexesToSwap.pop()

        indexesToSwap.forEach(index => {
          swapNumberValue(numbers, numbers[index], numbers[index + 1])
        })

        moves++

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

        moves++

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

        moves++

      }

      // CANNOT MOVE
      else {

        clickedNumber.button.classList.add('cannotmove')
        setTimeout(() => {
          clickedNumber.button.classList.remove('cannotmove')
        }, 500);

      }

      movesNum.innerText = `${moves} moves`

      if (checkWin(numbers)) {

        const leaderBoardObj = {}

        boardDiv.style.display = 'none'
        titleH1.innerText = 'You Win!'

        clearInterval(timer)

        // 4 LEADERBOARD
        const inputName = document.createElement('input')
        inputName.placeholder = 'Insert your name'
        container.appendChild(inputName)

        // RANDOM NAME GENERATOR
        const characterName = uniqueNamesGenerator({ dictionaries: [names] });
        inputName.value = characterName

        const submitName = document.createElement('button')
        submitName.innerText = 'Sumbit'
        submitName.className = 'button'
        container.appendChild(submitName)

        submitName.addEventListener('click', () => {

          const date = new Date

          leaderBoardObj.name = inputName.value
          leaderBoardObj.moves = moves
          leaderBoardObj.seconds = seconds
          leaderBoardObj.date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`

          container.removeChild(ui)
          container.removeChild(inputName)
          container.removeChild(submitName)

          addToLeaderBoard(leaderBoardObj)

        })

        // NEW GANE
        const playButton = document.createElement('button')
        playButton.innerText = 'Play Again'
        playButton.classList.add('button')
        app.appendChild(playButton)

        playButton.addEventListener('click', () => {

          boardDiv.innerHTML = ''

          app.removeChild(playButton)
          if (document.querySelector('.container')) {
            app.removeChild(container)
          }

          newGame()

        })
      }

    })
  })
}

function swapNumberValue(numbers, number1, number2) {

  // Find the index of item that contains value1
  const indexOfValue1 = numbers.findIndex(number => number.value === number1.value)
  // and 2
  const indexOfValue2 = numbers.findIndex(number => number.value === number2.value)

  // Swap the values
  const tempValue = numbers[indexOfValue1].value

  number1.value = number2.value
  number2.value = tempValue

  const tempClass = numbers[indexOfValue1].button.className

  number1.button.className = number2.button.className
  number2.button.className = tempClass

  const tempInnerText = numbers[indexOfValue1].button.innerText

  number1.button.innerText = number2.button.innerText
  number2.button.innerText = tempInnerText

  if (number1.value < number2.value) {
    numbers[indexOfValue2].button.classList.add('canmove')
    setTimeout(() => {
      numbers[indexOfValue2].button.classList.remove('canmove')
    }, 250);
  } else {
    numbers[indexOfValue1].button.classList.add('canmove')
    setTimeout(() => {
      numbers[indexOfValue1].button.classList.remove('canmove')
    }, 250);
  }

  return numbers

}

function checkWin(numbers) {

  let winCount = 0

  numbers.forEach((number, i) => {

    if (number.value == i + 1) {
      winCount++
    }

  })

  if (winCount == 15) {

    return true

  } else {

    return false

  }
}

function addToLeaderBoard(leaderBoardObj) {

  // DOM
  document.querySelector('h1').innerText = 'LeaderBoard'
  const container = document.querySelector('.container')

  const leaderBoardDiv = document.createElement('div')
  leaderBoardDiv.className = 'leaderBoard'
  container.appendChild(leaderBoardDiv)

  createLeaderBoardRow(leaderBoardDiv)

  if (DEBUG_LEADERBOARD == true) {
    leaderBoardObj.seconds = Math.floor(Math.random() * (500 - 350 + 1)) + 350;
    leaderBoardObj.moves = Math.floor(Math.random() * (500 - 400 + 1)) + 400;
  }

  // LEADERBOARD LOGIC
  let actualLeaderBoard = localStorage.getItem("Leader Board")

  if (actualLeaderBoard == null) {

    actualLeaderBoard = []
    actualLeaderBoard.push(leaderBoardObj)
    localStorage.setItem("Leader Board", JSON.stringify(actualLeaderBoard))

  } else {

    actualLeaderBoard = JSON.parse(actualLeaderBoard)
    actualLeaderBoard.push(leaderBoardObj)

    // SORT LEADERBOARD ARRAY
    actualLeaderBoard.sort((a, b) => {
      return (a.moves + a.seconds) - (b.moves + b.seconds)
    })

    actualLeaderBoard = actualLeaderBoard.slice(0, 10)

    localStorage.setItem("Leader Board", JSON.stringify(actualLeaderBoard))
  }

  // DOM POPULATE
  for (let i = 0; i < actualLeaderBoard.length; i++) {

    const leader = actualLeaderBoard[i];
    const pos = i + 1 + '.'
    const name = leader.name
    const moves = leader.moves
    const secs = leader.seconds
    const date = leader.date

    createLeaderBoardRow(leaderBoardDiv, pos, name, moves, secs, date)
  }

  return
}

function createLeaderBoardRow(leaderBoardDiv,
  pos = '',
  name = 'name',
  moves = 'moves',
  secs = 'secs',
  date = 'date') {

  const leaderPosition = document.createElement('div')
  const leaderName = document.createElement('div')
  const leaderMoves = document.createElement('div')
  const leaderSeconds = document.createElement('div')
  const leaderDate = document.createElement('div')

  leaderPosition.innerText = pos
  leaderName.innerText = name
  leaderMoves.innerText = moves
  leaderSeconds.innerText = secs
  leaderDate.innerText = date

  leaderPosition.style.textAlign = 'right'
  leaderName.style.textAlign = 'left'
  leaderName.style.border = '1px solid #fff;'

  leaderBoardDiv.appendChild(leaderPosition)
  leaderBoardDiv.appendChild(leaderName)
  leaderBoardDiv.appendChild(leaderMoves)
  leaderBoardDiv.appendChild(leaderSeconds)
  leaderBoardDiv.appendChild(leaderDate)

  return leaderBoardDiv
}

newGame()


