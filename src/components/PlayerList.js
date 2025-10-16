export function PlayerList({ players, setPlayers }) {
    const setScore = function(i, diff) {
      players[i].score = Math.max(0, players[i].score + diff);
      setPlayers([...players]);
    }
    return (
      <>
        <div className="player-list">
          {players.map((player, i) => (
            <div key={i} className="player">
              <div className="name">{player.name || `Player ${i+1}`}</div>
              <div className="score">{player.score}</div>
              <div className="score-buttons">
                <input type="button" value="-1" disabled={player.score < 1} onClick={() => setScore(i, -1)} />
                <input type="button" value="+1" onClick={() => setScore(i, 1)} />
                <input type="button" value="+2" onClick={() => setScore(i, 2)} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }