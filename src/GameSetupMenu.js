import React, {useEffect, useState} from 'react';
import './GameSetupMenu.css';

const GameSetupMenu = ({onStartGame, defaultValues }) => {
    const [settings, setSettings] = useState(defaultValues);
    const [isComputer,setIsComputer]=useState(false);
    const [nameError,setNameError]=useState('');
    const [colorError, setColorError] = useState('');
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {onStartGame();}
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {document.removeEventListener('keydown', handleKeyDown);};
    }, [onStartGame]);

    useEffect(() => {
        if (nameError){
            const timer = setTimeout(() => setNameError(''), 8000);
            return () => clearTimeout(timer);
        }
        if (colorError) {
            const timer = setTimeout(() => setColorError(''), 8000);
            return () => clearTimeout(timer);
        }
    }, [colorError,nameError]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const updatedValue = type === 'number' ? parseInt(value, 10) : value;
        setSettings({ ...settings, [name]: updatedValue });
    };
    const handlePlayerChange = (player, key, value) => {
        if (!isComputer) {
            if (key === 'name') {
                setNameError('');
                const otherPlayer = player === 'player1' ? 'player2' : 'player1';
                if (value === settings[otherPlayer].name) {
                    setNameError(`*${otherPlayer} already chose this name!`);
                    setSettings({...settings, [player]: {...settings[player], name: player}});
                } else {
                    setSettings({...settings, [player]: {...settings[player], name: value}});
                }
                return;
            }
            if (key === 'color') {
                setColorError('');
                const otherPlayer = player === 'player1' ? 'player2' : 'player1';
                if (value === settings[player === 'player1' ? 'player2' : 'player1'].color) {
                    setColorError(`*${otherPlayer} already chose this color!`);
                    const newColor = getRandomColor();
                    setSettings({...settings, [player]: {...settings[player], color: newColor}});
                    return;
                }
            }
        }
        setSettings({ ...settings, [player]: { ...settings[player], [key]: value } });
    };
    const getRandomColor = () => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };
    const validateSettings = () => {
        let newSettings = { ...settings, isComputer: isComputer }; // Include isComputer in newSettings

        if (isComputer) {
            let computerName = 'computer';
            let computerColor = getRandomColor();
            let attempts = 0;

            if (newSettings.player1.name.toLowerCase() === 'computer') {
                computerName = 'bot';
            }

            while (computerColor === newSettings.player1.color && attempts < 3) {
                computerColor = getRandomColor();
                attempts++;
            }

            newSettings.player2 = {
                ...newSettings.player2,
                name: computerName,
                color: computerColor
            };
        }

        onStartGame(newSettings);
    };
    return (
        <div className="players-setup">
            <h2 className="game-setup-title">Game Setup</h2>
            <div className="setup-container">
                <div className="frame-container">
                    <div>
                        <label className="setup-label">board rows: </label>
                        <input
                            type="number"
                            name="numRows"
                            min={6}
                            max={100}
                            value={settings.numRows}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="setup-label">board columns: </label>
                        <input
                            type="number"
                            name="numCols"
                            min={7}
                            max={100}
                            value={settings.numCols}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="frame-container">
                    <div>
                        <label className="setup-label">player1 name: </label>
                        <input
                            type="text"
                            name="player1Name"
                            placeholder="player1"
                            onChange={(e) => handlePlayerChange('player1', 'name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="setup-label">player1 color: </label>
                        <input
                            type="color"
                            name="player1Color"
                            value={settings.player1.color}
                            onChange={(e) => handlePlayerChange('player1', 'color', e.target.value)}
                        />
                    </div>
                    {!isComputer && (
                        <>
                            <div>
                                <label className="setup-label">player2 name: </label>
                                <input
                                    type="text"
                                    name="player2Name"
                                    placeholder="player2"
                                    onChange={(e) => handlePlayerChange('player2', 'name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="setup-label">player2 color: </label>
                                <input
                                    type="color"
                                    name="player2Color"
                                    value={settings.player2.color}
                                    onChange={(e) => handlePlayerChange('player2', 'color', e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="frame-container">
                    <button className="computer-button" onClick={() => setIsComputer(prevState => !prevState)}>
                        {isComputer ? "Player 2" : "Computer"}
                    </button>
                </div>
            </div>
            {colorError && (
                <div className="color-error-message">
                    {colorError}
                </div>
            )}
            {nameError && (
                <div className="name-error-message">
                    {nameError}
                </div>
            )}
            <button className="setup-start-button" onClick={validateSettings}>
                Start Playing
            </button>
        </div>

    );
};

export default GameSetupMenu;