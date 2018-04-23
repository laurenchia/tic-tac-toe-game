import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" style={props.color} onClick={props.onClick}>   
        {/* changed onClick={() => props.onClick()} to just onClick={props.onClick}, as passing the function down is enough for our example.*/}
        {/* Note that onClick={props.onClick()} would not work because it would call props.onClick immediately instead of passing it down*/}
        {/* Note that the onClick prop has a function passed e.g. onClick={() => alert('click')}> rather than onClick={alert('click')} which would trigger alert immediately instead of when btn clicked */}    
        {props.value}
      </button>
      )
}

class Board extends React.Component {
  renderSquare(i) {
    if (this.props.winner) {
      if (i === this.props.winner[0] || i === this.props.winner[1] || i === this.props.winner[2]) {
        return (
          <Square 
          value={this.props.squares[i]}
          squareIndex={i}
          onClick={() => this.props.onClick(i)}
          color={{'color': 'blue'}}
          />
        )
      {/* What looks like double curly braces in 'color' is just an object literal in a prop */}
      } else {
          return (
            <Square 
              value={this.props.squares[i]}
              squareIndex={i}
              onClick={() => this.props.onClick(i)}
            />
          )  
      {/* If you don't have this else in the if, it will render only the winning squares and not render any other squares */}
      }
    } 
    else {
      return(
        <Square 
          value={this.props.squares[i]}
          squareIndex={i}
          onClick={() => this.props.onClick(i)}
        />
      ) 
    }
  }

  //   return (i == this.props.winner[0] || i == this.props.winner[1] || i == this.props.winner[2]) ?
  //   (
  //     <Square 
  //       value={this.props.squares[i]}
  //       squareIndex={i}
  //       onClick={() => this.props.onClick(i)}
  //     />
  //   ) : (
  //     <Square 
  //       value={this.props.squares[i]}
  //       squareIndex={i}
  //       onClick={() => this.props.onClick(i)}
  //     />
  //   );
  // }

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
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true
    };

    {/* Array of 9 nulls that correspond to the 9 squares */}  
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    {/* slice() helps immutability - by creating a new squares array each time a move is made, we can easily store the past board states simultaneously*/}
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    {/*Breaks (no longer handles click / ultimately stops game) if a winner square is returned or a square is returned (because it's already filled)*/}
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    {/* square -  push a new entry onto the stack by concatenating the new history entry to make a new history array. */}
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
    const draw = isDraw(current.squares);

    {/* Array.map() creates a new array with results of calling a function on every element in the calling array */}
    {/* In this case, array of every move button that is needed */}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

        return (move === this.state.stepNumber) ? (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>{desc}</b>
            </button>
          </li>
        ) : (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        );
    });
    {/* Ternary operator would do the same job as if else but a bit shorter :) */}
    {/* Would get error if you had the if else where the {desc} was like I had before */}
    {/* because it was trying to return multiple buttons of different desc types at a time */}
    {/* Now, it evaluates the condition first and renders accordingly, forcing it to render one at a time */}

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else if (draw) {
      status = draw;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isAsc ? moves : moves.reverse()}</ol>
        </div>
        <div>
          <button onClick={() => this.setState({isAsc : !this.state.isAsc})}>{this.state.isAsc ? 'Sort by descending' : 'Sort by ascending'}</button>
        </div>
        <div>
          {winner ? (
            <button>Play Again</button>
          ) : (
            null
          )}
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
      {/* Winning line number */}
      return [a, b, c];
    }
  }
  return null;
}

function isDraw(squares) {
  for (let i=0; i < squares.length; i++) {
    if (!squares[i]) {
      return null;
    }
  }
  return "Draw!"
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
