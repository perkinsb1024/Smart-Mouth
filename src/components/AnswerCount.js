export function AnswerCount({ n, showAnswers, setShowAnswers }) {
    return (
      <div className="answer-count">
        <div>
          There {n === 1 ? "is" : "are"} {n == 0 ? "no" : n} possible answer{n === 1 ? "" : "s"}
        </div>
        {n > 0 &&
        <div className="show-hide-answers" onClick={() => { setShowAnswers(!showAnswers); }}>
          ({showAnswers ? 'hide' : 'show'})
        </div>}
      </div>
    );
  }