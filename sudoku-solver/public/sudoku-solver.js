const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  puzzle.stringToGrid(textArea.value)
  textArea.addEventListener('keyup', ev => {
    puzzle.handleTextAreaInput(ev)
  })

  let boxes = document.getElementsByClassName('sudoku-input')
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('keyup', (ev) => {
      textArea.value = puzzle.handleGridInput(ev) || textArea.value
    })
  }

  let solve = document.getElementById('solve-button')
  solve.addEventListener('click', ev => {
    puzzle.solvePuzzle(textArea.value)
    ev.preventDefault()
  })

  let clear = document.getElementById('clear-button')
  clear.addEventListener('click', ev => {
    puzzle.clearInput(ev)
  })
});



/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
let puzzle =  {
  isValidInput: (input) => {
    let num = parseInt(input)
    return 9 >= num  && num >= 1 ? true : false
  },

  clearInput: function(ev) {
    textArea.value = '.'.repeat(81)
    this.stringToGrid(textArea.value)
  },

  /**
   * Displays numbers input in the textArea on the grid
   * @param {String} input 
   */
  stringToGrid: function(input) {
    let parsed = this.parsePuzzleString(input)
  
    for (const box in parsed) {
      if (parsed.hasOwnProperty(box)) {
        const el = parsed[box];
        document.getElementById(box).value = el == '.' ? '': el
      }
    }
  },

  /**
   * Displays the numbers input in the grid in the textArea
   */
  gridToString: function() {
    let string = ''
    let boxes = document.getElementsByClassName('sudoku-input')
  
    for (let i = 0; i < boxes.length; i++) {
      const el = boxes[i]
      el.value == '' ? string += '.' : string += el.value
    }
  
    return string
  },

  handleGridInput: function(ev) {
    if (this.isValidInput(ev.key)) {
      this.hideError()
      return this.gridToString()
    } else if (ev.key == 'Tab') {
      this.hideError()
    } else {
      this.showError('Invalid Input')
    }
  },

  handleTextAreaInput: function(ev) {
    if (this.isValidInput(ev.key) || ev.key == '.') {
      this.hideError()
      this.stringToGrid(ev.target.value)
    } else {
      this.showError('Invalid input')
    }
  },

  /**
   * Parses puzzle string and returns an object that has the
   * html classes as property 
   * @param {String} input 
   */
  parsePuzzleString: function(input) {
    if (input.length != 81) this.showError('Error: Expected puzzle to be 81 characters long.')
    if (input.length == 81) this.hideError()

    let arr = input.split('')
    let obj = {}
    let rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    let currRow = 0
    let currCol = 1
    
    for (let i = 1; i <= arr.length; i++) {
      const val = arr[i - 1];
      const prop = rowLabels[currRow] + currCol
      obj[prop] = val

      if (i % 9 === 0) {
        currRow++
        currCol = 1
      } else {
        currCol++
      }
    }

    return obj
  },

  showError: function(msg) {
    let el = document.getElementById('error-msg')
    el.innerHTML = `<p>${msg}</p>`
  },

  hideError: function() {
    let el = document.getElementById('error-msg')
    el.innerHTML = ''
  },

  /**
   * Takes a puzzle string and returns an object with rows, cols
   * and boxes arrrays used to solve the puzzle
   * 
   * @param {String} input 
   */
  makePuzzleObj: function(input) {
    let arr = input.split('')
    let boxes = []
    let rows = []
    let cols = []
    let currBox = 0
    let currRow = 0
    let currCol = 0

    for (let i = 1; i <= arr.length; i++) {
      let val = arr[i - 1];

      if (val === '.') val = undefined

      boxes[currBox] == undefined  ? boxes[currBox] = [val] : boxes[currBox].push(val)
      rows[currRow] == undefined  ? rows[currRow] = [val] : rows[currRow].push(val)
      cols[currCol] == undefined  ? cols[currCol] = [val] : cols[currCol].push(val)

      if (i % 9 === 0 && (currRow + 1) % 3 === 0) {
        currBox++
        currRow++
        currCol = 0
      } else if (i % 9 === 0) {
        currBox -= 2
        currRow++
        currCol = 0
      } else if ((currCol + 1) % 3 === 0) {
        currBox++
        currCol++  
      } else {
        currCol++
      }
    }

    return {
      boxes,
      rows,
      cols
    }
  },

  isValidPuzzle: function(input) {
    let puzzle = this.makePuzzleObj(input)
    let hasDuplicate = false
    let hasAllNumbers = true

    Object.keys(puzzle).forEach(key => {
      puzzle[key].forEach(child => {
        if (!this.checkForAllNumbers(child)) {
          hasAllNumbers = false
        }
      })
    });      
    
    return hasAllNumbers && !hasDuplicate ? true : false
  },

  checkForAllNumbers: function(arr) {
    let sum = arr.reduce((acc, curr) => {
      return parseInt(acc) + parseInt(curr)
    })
    
    return sum === 45 ? true : false
  },

  findMissingNumbers: function(arr) {
    let numbers = ['1','2','3','4','5','6','7','8','9']
    let missing = numbers.filter((val) => {
      return !arr.includes(val)
    })

    return missing
  },

  countUndefined: function(puzzleObj) {
    let count = 0

      Object.keys(puzzleObj).forEach(key => {
        puzzleObj[key].forEach(el => {
          el.forEach(val => {
            if (val === undefined) {
              count++
            }
          })
        })
      })

      return count
  },

  solveRow: function(puzzle, row, rowNum) {
    let missing = this.findMissingNumbers(row)

    for (const idx in row) {
      if (row.hasOwnProperty(idx)) {
      let i = parseInt(idx)

      // Find current Box and Box element
      let boxIdx = Math.floor( i / 3 ) + Math.floor(rowNum  / 3) * 3
      let boxElIdx = (rowNum * 3) % 9
      
      let num = row[idx];
        idx % 3 === 0 ? boxElIdx = (rowNum * 3) % 9 : boxElIdx += idx % 3


        if (num === undefined) {
          // Select corresponding elements
          let col = puzzle.cols[idx]
          let box = puzzle.boxes[boxIdx]
          
          // Filter numbers that are in corresponding elements
          let possibleNums = missing.filter(num => {
            let inCol = col.includes(num)
            let inBox = box.includes(num)

            return !inCol && !inBox
          })
          
          if (possibleNums.length === 1) {
            let newNum = possibleNums[0]

            // set corresponding elements
            row[idx] = newNum
            col[rowNum] = newNum
            box[boxElIdx] = newNum 
          }
        }
      }
      
      return puzzle

    }
  },

  solveCol: function(puzzle, col, colNum) {
    let missing = this.findMissingNumbers(col)
    
    for (const idx in col) {
      if (col.hasOwnProperty(idx)) {
        let i = parseInt(idx)
        const num = col[idx];

        // Find current Box and Box Element
        let boxIdx = Math.floor( i / 3 ) * 3 + Math.floor((colNum / 3))
        let boxElIdx = (i % 3) * 3 + (colNum % 3)

        let row = puzzle.rows[i]
        let box = puzzle.boxes[boxIdx]
        
        if (num === undefined) {
          let possibleNums = missing.filter(num => {
            let inRow = row.includes(num)
            let inBox = box.includes(num)

            return !inRow && !inBox
          })
          
          if (possibleNums.length === 1) {
            let newNum = possibleNums[0]

            col[idx] = newNum
            row[colNum] = newNum 
            box[boxElIdx] = newNum
          }
        }
      }
    }
    return puzzle
  },

  solveBox: function(puzzle, box, boxNum) {
    let missing = this.findMissingNumbers(box)

    for (const idx in box) {
      if (box.hasOwnProperty(idx)) {
        let i = parseInt(idx)
        const num = box[idx];

        let colForm = (i % 3) + (boxNum % 3) * 3
        let rowForm = Math.floor(boxNum / 3) * 3 + Math.floor(i / 3)

        let col = puzzle.cols[colForm]
        let row = puzzle.rows[rowForm]
        
        if (num === undefined) {
          let possibleNums = missing.filter(val => {
            let inCol = col.includes(val)
            let inRow = col.includes(val)

            return !inCol && !inRow
          })

          if (possibleNums.length === 1) {
            let newNum = possibleNums[0]
            
            row[colForm] = newNum
            col[rowForm] = newNum
            box[i] = newNum
          }
        }
      }
    }
  },

  solvePuzzle: function(input) {
    let puzzle = this.makePuzzleObj(input)
    let prevCt
    let newCt

    do {
      prevCt = this.countUndefined(puzzle)

      puzzle.rows.forEach((row, i)  => {
        this.solveRow(puzzle, row, i)
      })
      puzzle.cols.forEach((col, i) => {
        this.solveCol(puzzle, col, i)
      })
      puzzle.boxes.forEach((box, i) => {
        this.solveBox(puzzle, box, i)
      })
      
      newCt = this.countUndefined(puzzle)
    } while (prevCt !== newCt);
    
    if (prevCt === newCt && newCt !== 0) {
      throw Error(`Couldn't solve the puzzle`)
    } else {
      this.showSolution(puzzle)
      return this.isValidPuzzle ? true : false
    }
  },

  showSolution: function(obj) {
    let str = ''

    for (let row in obj.rows) {
      for (let num in obj.rows[row]) {
        str += obj.rows[row][num]
      }
    }
    
    this.stringToGrid(str)
    this.gridToString()
  }
}

try {
  module.exports = puzzle
  
} catch (e) {}


