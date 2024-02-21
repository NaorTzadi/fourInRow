import React, { useEffect, useState } from 'react';
import './GameBoard.css';
const GameBoard = ({ player1, player2, numRows, numCols,isComputer, onEndGame }) => {
    const [board, setBoard] = useState(Array(numRows).fill().map(() => Array(numCols).fill(null)));
    const [currentPlayer, setCurrentPlayer] = useState(isComputer ? 'player1' : (Math.random() < 0.5 ? 'player1' : 'player2'));
    const [gameOver, setGameOver] = useState(false);
    const [winningPlayer, setWinningPlayer] = useState(null);
    const [winningCells, setWinningCells] = useState([]);
    const [moves, setMoves] = useState([]);
    const [replayIndex, setReplayIndex] = useState(null);
    const [timer, setTimer] = useState(10); // 10-second timer
    const [isFallingAnimation,setIsFallingAnimation]=useState(false);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player1ScoreInCurrentMatch,setPlayer1ScoreInCurrentMatch]=useState(0);
    const [player2ScoreInCurrentMatch,setPlayer2ScoreInCurrentMatch]=useState(0);
    const [showScores, setShowScores] = useState(false);
    const [allowComputerMove, setAllowComputerMove] = useState(false);
    const [didPressPlayAgain,setDidPressPlayAgain]=useState(false);
    const [didReplay,setDidReplay]=useState(false);
    const [didMiss,setDidMiss]=useState(false);

    const togglePlayer = () => {
        const nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        setCurrentPlayer(nextPlayer);
        if (nextPlayer === 'player2' && isComputer){
            setAllowComputerMove(true);
        }
    };
    useEffect(() => {
        if (allowComputerMove && !gameOver && !isFallingAnimation) {
            handleCellClick(Math.floor(Math.random() * numCols));
            setAllowComputerMove(false);
        }
    }, [allowComputerMove, gameOver, isFallingAnimation]);

    useEffect(() => {
        setTimer(10);
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [currentPlayer]);

    useEffect(() => {
        if (timer === 0) {
            togglePlayer();
        }
    }, [timer]);

    const handleCellClick = (col) => {
        if (gameOver || replayIndex !== null ||isFallingAnimation) return;

        let emptyRow = -1;
        for (let row = numRows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                emptyRow = row;
                break;
            }
        }
        if (emptyRow !== -1) {
            animateFallingPiece(col, emptyRow, () => {
                let newBoard = [...board];
                newBoard[emptyRow][col] = currentPlayer;
                setBoard(newBoard);
                setMoves([...moves, { player: currentPlayer, row: emptyRow, col }]);
                if (checkForWin(emptyRow, col, newBoard)) {
                    setGameOver(true);
                    setWinningPlayer(currentPlayer === 'player1' ? player1.name : player2.name);
                    setWinningCells(getWinningCells(emptyRow, col, newBoard));
                } else if (!gameOver && !(currentPlayer === 'player2' && isComputer) && replayIndex === null) {
                    setDidMiss(checkForMiss(newBoard,currentPlayer));
                }
                if (currentPlayer === 'player1') {
                    setPlayer1Score(prevScore => prevScore + 1);
                    setPlayer1ScoreInCurrentMatch(+1);
                } else {
                    setPlayer2Score(prevScore => prevScore + 1);
                    setPlayer2ScoreInCurrentMatch(+1);
                }
                togglePlayer();
                setTimer(10);
            });
        }
    };
    useEffect(() => {
        let timer;
        if (didMiss) {
            timer = setTimeout(() => {
                setDidMiss(false);
            }, 5000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [didMiss]);
    const checkForMiss = (board, currentPlayer) => {
        const numRows = board.length;
        const numCols = board[0].length;
        let countPlayerCells = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (board[row][col] === currentPlayer) countPlayerCells++;
            }
        }

        if (countPlayerCells <= 3) return false;
        const findThreeCellSequences = () => {
            let sequences = [];
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col <= numCols - 3; col++) {
                    if (board[row][col] === currentPlayer &&
                        board[row][col + 1] === currentPlayer &&
                        board[row][col + 2] === currentPlayer) {
                        sequences.push([[row, col], [row, col + 1], [row, col + 2]]);
                    }
                }
            }
            // Check vertically
            for (let col = 0; col < numCols; col++) {
                for (let row = 0; row <= numRows - 3; row++) {
                    if (board[row][col] === currentPlayer &&
                        board[row + 1][col] === currentPlayer &&
                        board[row + 2][col] === currentPlayer) {
                        sequences.push([[row, col], [row + 1, col], [row + 2, col]]);
                    }
                }
            }
            return sequences;
        };
        let threeCellSequences = findThreeCellSequences();
        console.log(threeCellSequences);

        let validSequences = validateSequences(board, threeCellSequences, numCols, numRows);

        return validSequences.length > 0;
    };
    const validateSequences = (board, sequences, numCols, numRows) => {
        let validSequences = [];

        sequences.forEach(sequence => {
            let firstPoint = sequence[0];
            let lastPoint = sequence[sequence.length - 1];

            let firstPointBlocked, lastPointBlocked;

            const isHorizontal = sequence.every(([row, _]) => row === firstPoint[0]);
            const isVertical = sequence.every(([_, col]) => col === firstPoint[1]);

            if (isHorizontal) {
                if (firstPoint[0] < numRows - 1 && firstPoint[1] > 0) {
                    console.log("Index beneath left end:", [firstPoint[0] + 1, firstPoint[1] - 1]);
                }
                if (lastPoint[0] < numRows - 1 && lastPoint[1] < numCols - 1) {
                    console.log("Index beneath right end:", [lastPoint[0] + 1, lastPoint[1] + 1]);
                }
                firstPointBlocked = firstPoint[1] === 0 || board[firstPoint[0]][firstPoint[1] - 1] !== null ||
                    (firstPoint[0] < numRows - 1 && board[firstPoint[0] + 1][firstPoint[1] - 1] === null);

                lastPointBlocked = lastPoint[1] === numCols - 1 || board[lastPoint[0]][lastPoint[1] + 1] !== null ||
                    (lastPoint[0] < numRows - 1 && board[lastPoint[0] + 1][lastPoint[1] + 1] === null);

            } else if (isVertical) {
                firstPointBlocked = firstPoint[0] === 0 || board[firstPoint[0] - 1][firstPoint[1]] !== null;
                lastPointBlocked = lastPoint[0] === numRows - 1 || board[lastPoint[0] + 1][lastPoint[1]] !== null;
            }

            if (!firstPointBlocked || !lastPointBlocked) {
                validSequences.push(sequence);
            }
        });
        return validSequences;
    };
    const checkForWin = (row, col, board) => {
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [-1, 1]
        ];
        const currentPlayer = board[row][col];
        for (const [dx, dy] of directions) {
            let count = 1;
            for (let i = 1; i <= 3; i++) {
                const newRow = row + i * dy;
                const newCol = col + i * dx;
                if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols || board[newRow][newCol] !== currentPlayer) {
                    break;
                }
                count++;
            }
            for (let i = 1; i <= 3; i++) {
                const newRow = row - i * dy;
                const newCol = col - i * dx;
                if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols || board[newRow][newCol] !== currentPlayer) {
                    break;
                }
                count++;
            }
            if (count >= 4) {
                return true;
            }
        }
        return false;
    };
    const getWinningCells = (row, col, board) => {
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [-1, 1]
        ];
        const currentPlayer = board[row][col];
        for (const [dx, dy] of directions) {
            let count = 1;
            let winningCells = [[row, col]];
            for (let i = 1; i <= 3; i++) {
                const newRow = row + i * dy;
                const newCol = col + i * dx;
                if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols || board[newRow][newCol] !== currentPlayer) {
                    break;
                }
                winningCells.push([newRow, newCol]);
                count++;
            }
            for (let i = 1; i <= 3; i++) {
                const newRow = row - i * dy;
                const newCol = col - i * dx;
                if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols || board[newRow][newCol] !== currentPlayer) {
                    break;
                }
                winningCells.push([newRow, newCol]);
                count++;
            }
            if (count >= 4) {
                return winningCells;
            }
        }
        return [];
    };
    const resetBoard = () => {
        if (didPressPlayAgain && winningPlayer===null) {
            setPlayer1Score(prevScore => Math.max(0, prevScore - player1ScoreInCurrentMatch));
            setPlayer2Score(prevScore => Math.max(0, prevScore - player2ScoreInCurrentMatch));
        }
        if (winningPlayer!==null || didPressPlayAgain){
            setBoard(Array(numRows).fill().map(() => Array(numCols).fill(null)));
            setGameOver(false);
            setWinningCells([]);
            setWinningPlayer(null);
            setReplayIndex(null);
            setCurrentPlayer(isComputer ? 'player1' : (Math.random() < 0.5 ? 'player1' : 'player2'));
            setPlayer1ScoreInCurrentMatch(0);
            setPlayer2ScoreInCurrentMatch(0);
            setAllowComputerMove(false);
            setDidPressPlayAgain(false);
            return () => clearTimeout(timer);
        }
    };
    const animateFallingPiece = (col, finalRow, callback) => {
        setIsFallingAnimation(true);
        for (let row = 0; row <= finalRow; row++) {
            setTimeout(() => {
                let tempBoard = board.map((r, rowIndex) =>
                    r.map((cell, colIndex) => {
                        if (rowIndex === row && colIndex === col) {
                            return currentPlayer;
                        }
                        return cell;
                    })
                );
                setBoard(tempBoard);

                if (row === finalRow) {
                    setTimeout(() => {
                        setIsFallingAnimation(false);
                        callback();
                    }, 100);
                }
            }, row * 100);
        }
    };

    const replayMoves = () => {
        if (replayIndex!==null)return
        setBoard(Array(numRows).fill().map(() => Array(numCols).fill(null)));
        setGameOver(false);
        setDidReplay(true);
        setWinningCells([]);
        setReplayIndex(0);
    };
    useEffect(() => {
        if (replayIndex !== null && replayIndex < moves.length) {
            const move = moves[replayIndex];
            setCurrentPlayer(move.player);
            animateFallingPiece(move.col, move.row, () => {
                setTimeout(() => {
                    if (replayIndex < moves.length - 1) {
                        setReplayIndex(replayIndex + 1);
                    } else {

                        setGameOver(true);
                        setReplayIndex(null);
                    }
                }, 1000);
            });
        }
    }, [replayIndex, moves]);
    return (
        <div className="game-container">
            {!gameOver && (
                <div className="current-player-message">
                    {currentPlayer === 'player1' ? `${player1.name}'s Turn` : `${player2.name}'s Turn`}
                </div>
            )}
            <div className="game-board" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
                {board.map((row, rowIndex) => (
                    <div className="row" key={`row-${rowIndex}`}>
                        {row.map((cell, colIndex) => {
                            const isWinningCell = winningCells.some(([r, c]) => r === rowIndex && c === colIndex);
                            let cellStyle = {};
                            if (cell === 'player1') {
                                cellStyle.backgroundColor = player1.color;
                            } else if (cell === 'player2') {
                                cellStyle.backgroundColor = player2.color;
                            }
                            return (
                                <div
                                    className={`cell ${isWinningCell ? 'winning-cell' : ''}`}
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    onClick={() => handleCellClick(colIndex)}
                                    style={cellStyle}
                                ></div>
                            );
                        })}
                    </div>
                ))}
                <div className="button-container">
                    <button className="play-again-button" onClick={() => {setDidReplay(false);setMoves([]);setDidPressPlayAgain(true); resetBoard()}}>Play Again</button>
                    <button className="settings-button" onClick={onEndGame}>Settings</button>
                    <button className="score-button" onClick={() => setShowScores(!showScores)}>Score</button>
                </div>

                {(gameOver || replayIndex !== null)&& (
                    <div className="game-over-message">{gameOver && `${winningPlayer} won!`}</div>
                )}
                {((gameOver || replayIndex !== null) && !didReplay) && (
                    <button className="replay-button" onClick={replayMoves}>Replay</button>
                )}
                {showScores && (
                    <div className="score-container">
                        <div className="player-score">{`${player1.name}: ${player1Score}`}</div>
                        <div className="player-score">{`${player2.name}: ${player2Score}`}</div>
                    </div>
                )}
                {didMiss && (
                    <p>{currentPlayer === 'player1' ? `${player2.name} missed` : `${player1.name} missed`}</p>
                )}
            </div>
        </div>
    );
};
export default GameBoard;
