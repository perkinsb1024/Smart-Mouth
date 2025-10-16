export function AnswerCount({ n, showAnswers, setShowAnswers }) {
  if (n === 0) { return; }
  return (
    <div className="answer-count">
      <div>
        There {n === 1 ? "is" : "are"} {n} possible answer{n === 1 ? "" : "s"}
      </div>
      <div className="show-hide-answers" onClick={() => { setShowAnswers(!showAnswers); }}>
        ({showAnswers ? 'hide' : 'show'})
      </div>
    </div>
  );
  }