import React, {useEffect} from 'react';
import './GameLobby.css';

const GameLobby = ({ onGoToSetup }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {onGoToSetup();}
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {document.removeEventListener('keydown', handleKeyDown);};
    }, [onGoToSetup]);

    return (
        <div className="game-lobby">
            <div className="info-frames-container">
                <div className="info-frame">
                    <div className="lobby-frame-container">
                        <div className="front">About Us</div>
                        <div className="back">we are, or more like i am, a computer science student who was tasked to create an odd version
                            of the four in a row game by my very judgmental lecturer who is most definitely not reading this right now
                            as im sure he has better things to do than to latch on to every minute detail in a student's project.</div>
                    </div>
                </div>
                <div className="info-frame">
                    <div className="lobby-frame-container">
                        <div className="front">About the App</div>
                        <div className="back">player vs computer, color choosing option, board size choosing option, replay game option,
                            limiting each player turn to 10 seconds, statistics display, ball falling animation, dark/light theme toggle,
                            background soundtrack toggle. user friendly interaction such as key listeners ('ENTER'), reactive elements and creative elements display.  </div>
                    </div>
                </div>
                <div className="info-frame">
                    <div className="lobby-frame-container">
                        <div className="front">Instructions</div>
                        <div className="back">The four in a row rules are very simple.
                            It’s always played with 2 players and in a 7x6 grid.
                            Each turn each player puts a piece of his color inside a column and it will fall until it reaches the lowest available spot.
                            The one who can put 4 pieces of the same color in a row horizontally, vertically or diagonally wins.
                            If no one manages to do it then the match ends in a draw.
                        </div>
                    </div>
                </div>
            </div>
            <button className="start-game-button" onClick={onGoToSetup}>
                Start
            </button>
        </div>
    );
};

export default GameLobby;