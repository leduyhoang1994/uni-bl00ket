import { Question } from "@common/types/game.type";

export default function GameQuestions({
  questions,
}: {
  questions: Question[];
}) {
  return (
    <>
      {questions.map((q) => {
        return (
          <div key={q.id}>
            <p>
              <b>{q.id}</b> {q.text}
            </p>
            <ul>
              {q.answers.map((a) => {
                return (
                  <li key={a.id} style={{ listStyle: "none" }}>
                    <input
                      readOnly
                      type="radio"
                      id={a.id}
                      name={q.id}
                      value={a.id}
                      checked={a.id === q.correctAnswerId}
                      className="me-2"
                    />
                    <label htmlFor={a.id}>{a.text}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}
