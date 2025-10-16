import { AnswerWord } from './AnswerWord'

export function WordList({ show, wordList }) {
  if (!show) { return null; }
  return (
    <div className="word-list">
      {wordList.map((word, i) => (
        <AnswerWord word={word} key={i} />
      ))}
    </div>
  );
}