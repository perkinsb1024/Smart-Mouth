export function HelpDialog({ show, setShow, setShowSettings }) {
    if (!show) { return null; }
    return (
        <div className="help-dialog-container modal-container" onClick={() => setShow(false)}>
            <div className="help-dialog modal" onClick={(e) => e.stopPropagation()}>
                <div className="container">
                    <div className="title">Game Setup</div>
                    Click or tap the gear in the upper-right corner to open game settings. Click "Add new player" for each player you want to add, then enter their name in the text field. You can click the "X" button next to a player's name to remove them.
                    From here you can also reset scores, adjust the minimum valid word length and enable or disable the countdown timer when dealing tiles.
                </div>
                <div className="container">
                    <div className="title">How To Play</div>
                    When all players are ready, click the "Deal" button. Two letters will appear in the orange and green tiles. These letters represent the first and last letter of the answer words, respectively.
                    Each player competes to be the first call out a valid word. The first player to do so gets 2 points (click the "+2" button under their name). If two players call out valid words at the same time, each player receives one point ("+1").
                    If three or more players tie, a tie-breaker round is started: Deal a new set of tiles and only the players who tied will compete to call out a word. Resume normal play after that.
                    Gameplay continues until a player reaches at least 21 points. At that point, you can reset the scores and begin again.
                </div>
                <div className="container">
                    <div className="title">Checking Answers</div>
                    There are two ways to check answers. To check a single answer, type the word into the text box that says "Check an answer". It will show a red "X" for invalid words and a green "✓" for valid words.
                    Alternatively, next to the correct answer count, there is a "show" link, this will show all <div className="answer-word">valid words</div> with the more common words being <div className="answer-word highlighted">highlighted</div> in green.
                    Tapping or hovering over a word reveals a link that will open a new page with the word definition (an internet connection is required).
                </div>
                <div className="container buttons">
                    <input type="button" value="Settings" onClick={() => { setShow(false); setShowSettings(true); }} />
                    <input type="button" value="Done" onClick={() => setShow(false)} />
                </div>
            </div>
        </div>
    )
}