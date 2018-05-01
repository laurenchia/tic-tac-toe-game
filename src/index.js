import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>   
      {/* changed onClick={() => props.onClick()} to just onClick={props.onClick}, as passing the function down is enough for our example.*/}
      {/* Note that onClick={props.onClick()} would not work because it would call props.onClick immediately instead of passing it down*/}
      {/* Note that the onClick prop has a function passed e.g. onClick={() => alert('click')}> rather than onClick={alert('click')} which would trigger alert immediately instead of when btn clicked */}    
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

{/* Game component is responsible for displaying the list of moves */}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coords: [null]
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
    {/* Array of 9 nulls that correspond to the 9 squares */}  
  }

  handleClick(i) {
    {/* slice() helps immutability - by creating a new squares array each time a move is made, we can easily store the past board states simultaneously*/}
    {/* slice(begin, end) of extraction */}
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coords = current.coords.slice();
    console.log('squares ' + current.squares);
    console.log('coords ' + current.coords);

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    {/*Breaks (no longer handles click / ultimately stops game) if a winner square is returned or a square is returned (because it's already filled)*/}
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    console.log('coordinates value ' + coords);

    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords.concat(determineCoordinates(i))
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    {/* square -  push a new entry onto the stack by concatenating the new history entry to make a new history array. */}
    {/* concat merges two or more arrays, instead of altering existing arrays, makes new array */}
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const coordinates = history.map(move => move.coords[move.coords.length-1]);

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc} {coordinates[coordinates.length-1]}</button>
        </li>
      )
    });

    {/* console.log('all move.coords: ' + move.coords + 'last move.coords: ' + move.coords[move.coords.length-1]) */}

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  {/* Array of winning lines */}
  for (let i=0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function determineCoordinates(i) {
  let col = (i % 3) + 1;
  let row;

  /* Handling 0 index */
  if (i === 0) {
    row = 1;
    col = 1;
  }

  if (Math.floor(i / 3) === 0) {
    row = 1;
  } else if (Math.floor(i / 3) === 1) {
    row = 2;
  } else if (Math.floor(i / 3) === 2){
    row = 3;
  } else {
    row = 1;
  };

  return " (" + row + " , " + col + ")";
}

// function determineCoordinates(squares) {
//   const ROW_SIZE = 3;
//   console.log(squares);

//   let temporal = [];

//   for (let i=0; i < squares.length; i+=ROW_SIZE) {
//     temporal.push(squares.slice(i,i+ROW_SIZE));
//   };
//   {/* temporal is an array of arrays (each element is a row and then column) */}

//   console.log(temporal);
//   console.log(temporal[0][2]); {/* e.g. first row, third column */}
//   return " (" + " ," + ")";
// }

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
