const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    isValidInput: (input) => {
      let num = parseInt(input)
      return 9 >= num  && num >= 1 ? true : false
    },

    parsePuzzleString: function(input) {
      // console.log(this.makePuzzleObj(input))
      if (input.length != 81) this.showError()
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

    // showError: function() {
    //   let el = document.getElementById('error-msg')
    //   el.innerHTML(`<p>Error: Expected puzzle to be 81 characters long.`)
    // },

    makePuzzleObj: function(input) {
      let arr = input.split('')
      let rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
      let boxes = []
      let rows = []
      let cols = []
      let currBox = 0
      let currRow = 0
      let currCol = 0

      for (let i = 1; i <= arr.length; i++) {
        const val = arr[i - 1];

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
          // if (this.checkForDuplicate(child)) {
          //   hasDuplicate = true
          // }
          if (!this.checkForAllNumbers(child)) {
            hasAllNumbers = false
          }
        })
      });      
      
      return hasAllNumbers && !hasDuplicate ? true : false
    },

    // checkForDuplicate: function(arr) {
    //   let hasDuplicate = false
      
    //   arr.reduce(function(acc, curr) {
    //     if (acc.indexOf(curr) === -1) {
    //       acc.push(curr)
    //       return acc
    //     } else {
    //       hasDuplicate = true
    //       return acc
    //     }
    //   }, [])  
      
    //   return hasDuplicate
    // },

    checkForAllNumbers: function(arr) {
      let sum = arr.reduce((acc, curr) => {
        return parseInt(acc) + parseInt(curr)
      })
      
      return sum === 45 ? true : false
    },

    findMissingNumbers: function(arr) {
      let numbers = ['1','2','3','4','5','6','7','8','9']
      let missing = numbers.filter((val) => {
        // console.log(arr.includes(val))
        return !arr.includes(val)
      })

      return missing
    },

    countUndefined: function(puzzleObj) {
      let count = 0

        Object.keys(puzzleObj).forEach(key => {
          puzzleObj[key].forEach(el => {
            let counter = 0
            el.forEach(val => {
              if (val === undefined) {
                counter++
                count++
              }
            })
            // console.log(counter)
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
          // boxElIdx = (rowNum * 3) % 9
          // console.log()
          // console.log('row', rowNum, 'col', idx, 'box', boxIdx, 'boxel', boxElIdx)
          // console.log('Row:', row.join(' | '))
          // console.log('Col:', puzzle.cols[idx].join(' | '))
          // console.log('Box:', puzzle.boxes[boxIdx].join(' | '))


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
              row[idx] = possibleNums[0] 
              col[rowNum] = newNum
              box[boxElIdx] = newNum

              // console.log(newNum)
              // console.log('row', row.join(' | '))      
              // console.log('col', puzzle.cols[idx].join(' | '))    
              // console.log('box', puzzle.boxes[boxIdx].join(' | ')) 
            }
          }
        }
        // console.log(puzzle)
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
          
          // console.log(`Col: ${colNum} Row: ${i} Box: ${boxIdx} Boxel: ${boxElIdx}`)

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

          // console.log(`Box: ${boxNum} Boxel: ${i} Row: ${rowForm} Col: ${col}`)
          
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
        // console.log('while')
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
        // console.log(`Before: ${prevCt} \nAfter: ${newCt}`)
      } while (prevCt !== newCt);
      
      if (prevCt === newCt && newCt !== 0) {
        throw Error(`Couldn't solve the puzzle`)
      } else {
        return this.isValidPuzzle ? true : false
      }
    }
  }
} catch (e) {}


