/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      let textArea = document.getElementById('text-input')
      textArea.value = '356'      
      Solver.stringToGrid(textArea.value)
      let grid = Array.from(document.getElementsByClassName('sudoku-input'))

      for (let i = 0; i < textArea.value.length; i++) {
        assert.equal(grid[i].value, textArea.value[i])
      }
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      let grid = Array.from(document.getElementsByClassName('sudoku-input'))
      let nums = ['1', '4', '7']
      
      nums.forEach((num, i) => {
        grid[i].value = num
      })

      assert.equal(Solver.gridToString().slice(0,3), nums.join(''))
      done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      let textArea = document.getElementById('text-input')
      let grid = Array.from(document.getElementsByClassName('sudoku-input'))

      Solver.clearInput()      

      assert.equal('.'.repeat(81), textArea.value)
      grid.forEach(box => {
        assert.equal('', box.value)
      })
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let textArea = document.getElementById('text-input')
      let grid = Array.from(document.getElementsByClassName('sudoku-input'))

      Solver.solvePuzzle(input)

      assert.isAtLeast(textArea.value.indexOf('.'), 0)
      grid.forEach(box => {
        assert.isOk(box.value)
      })
      done();
    });
  });
});

