import React, { useState } from 'react';
import './App.css';
import { csTrivia } from './data.js';
import Card from './Card.jsx';

/* Mastered component is currently not appearing on screen, so I will have to debug that later */

function App() {
  const [order, setOrder] = useState(() => csTrivia.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [mastered, setMastered] = useState(() => new Set());

  const activeOrder = order.filter((idx) => !mastered.has(idx));
  const safePos = Math.min(pos, Math.max(0, activeOrder.length - 1));
  const currentCard = csTrivia[activeOrder[safePos]];

  const shuffleOrder = () => {
    const indices = [...order];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setOrder(indices);
    setPos(0);
  };

  const markMastered = (cardIndex) => {
    setMastered((prev) => {
      const copy = new Set(prev);
      copy.add(cardIndex);
      return copy;
    });
    setPos((p) => Math.max(0, p - 0));
  };

  const unmarkMastered = (cardIndex) => {
    setMastered((prev) => {
      const copy = new Set(prev);
      copy.delete(cardIndex);
      return copy;
    });
  };

  const handleAnswer = (wasCorrect) => {
    if (wasCorrect) {
      setCurrentStreak((s) => {
        const next = s + 1;
        setLongestStreak((l) => Math.max(l, next));
        return next;
      });
    } else {
      setCurrentStreak(0);
    }
  };

  return (
    <div className="App">
      <h1>Computer Science Trivia 🧑‍💻</h1>
      <p>Test your knowledge of the fundamentals!</p>
      <p>Total Cards: {csTrivia.length}</p>
      <div className="controls-row" style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <button onClick={shuffleOrder}>Shuffle Cards</button>
          <div style={{ color: '#5a6c7d' }}>{`Card ${activeOrder.length ? safePos + 1 : 0} of ${activeOrder.length}`}</div>
        </div>

        {/* Mastered badges shown horizontally next to the shuffle controls */}
        {mastered.size > 0 && (
          <div className="mastered-badges" style={{ marginLeft: 12 }}>
            {Array.from(mastered).map((idx) => (
              <div key={idx} className="mastered-badge">
                <span className="mastered-text">{csTrivia[idx].question}</span>
                <button className="mastered-unmark" onClick={() => unmarkMastered(idx)} aria-label={`Unmark card ${idx}`}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="streaks" style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <div>Current Streak: <strong>{currentStreak}</strong></div>
        <div>Longest Streak: <strong>{longestStreak}</strong></div>
      </div>

      {activeOrder.length > 0 ? (
        <Card
          key={activeOrder[safePos]}
          question={currentCard.question}
          answer={currentCard.answer}
          img={currentCard.img}
          category={currentCard.category}
          onAnswer={handleAnswer}
          onNext={() => setPos((p) => Math.min(p + 1, Math.max(0, activeOrder.length - 1)))}
          onPrev={() => setPos((p) => Math.max(p - 1, 0))}
          isFirst={safePos === 0}
          isLast={safePos === activeOrder.length - 1}
          onMaster={() => markMastered(activeOrder[safePos])}
        />
      ) : (
        <div style={{ marginTop: 24 }}>No more cards — you've mastered them all 🎉</div>
      )}

    </div>
  );
}

export default App;