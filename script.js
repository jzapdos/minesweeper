document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')
  const restartBtn = document.querySelector('#restart-btn')
  let width = 10
  let bombAmount = 20
  let flags = 0
  let squares = []
  let isGameOver = false

  // Timer variables
  let time = 0
  let timerInterval = null
  let timerStarted = false

  function startTimer() {
    if (timerStarted) return
    timerStarted = true
    timerInterval = setInterval(() => {
      time++
      document.getElementById('timer').innerText = time
    }, 1000)
  }

  function stopTimer() {
    clearInterval(timerInterval)
  }

  function resetTimer() {
    clearInterval(timerInterval)
    time = 0
    timerStarted = false
    document.getElementById('timer').innerText = time
  }

  // Create Board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount
    grid.innerHTML = ''
    squares = []
    isGameOver = false
    result.innerHTML = ''
    flags = 0
    resetTimer()

    // get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      // normal click
      square.addEventListener('click', function () {
        click(square)
      })

      // right click (flag)
      square.oncontextmenu = function (e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    // add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = i % width === 0
      const isRightEdge = i % width === width - 1

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
        if (i > 10 && squares[i - width].classList.contains('bomb')) total++
        if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
        if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
        if (i < 89 && squares[i + width].classList.contains('bomb')) total++
        squares[i].setAttribute('data', total)
      }
    }
  }

  createBoard()

  // Add flag
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && flags < bombAmount) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = '🚩'
        flags++
        flagsLeft.innerHTML = bombAmount - flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags--
        flagsLeft.innerHTML = bombAmount - flags
      }
    }
  }

  // Click on square
  function click(square) {
    if (!timerStarted) startTimer()
    const currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total != 0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }

  // Check neighboring squares
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0
    const isRightEdge = currentId % width === width - 1

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) click(squares[currentId - 1])
      if (currentId > 9 && !isRightEdge) click(squares[currentId + 1 - width])
      if (currentId > 10) click(squares[currentId - width])
      if (currentId > 11 && !isLeftEdge) click(squares[currentId - 1 - width])
      if (currentId < 98 && !isRightEdge) click(squares[currentId + 1])
      if (currentId < 90 && !isLeftEdge) click(squares[currentId - 1 + width])
      if (currentId < 88 && !isRightEdge) click(squares[currentId + 1 + width])
      if (currentId < 89) click(squares[currentId + width])
    }, 10)
  }

  // Game Over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true
    stopTimer()

    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  // Check for win
  function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
        stopTimer()
      }
    }
  }

  // Restart button
  restartBtn.addEventListener('click', () => {
    createBoard()
  })
})
