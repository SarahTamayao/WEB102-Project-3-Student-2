import React, { useState } from 'react';

function Card({ question, answer, img, category, onNext, onPrev, isFirst, isLast, onAnswer }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [answered, setAnswered] = useState(false);

    const normalize = (str) => {
        if (str === null || str === undefined) return '';
        const cleaned = String(str)
            .toLowerCase()
            .replace(/[\p{P}\p{S}]+/gu, ' ')
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return cleaned;
    };

    // used AI to determine best way to do fuzzy matching - levenshtein + token overlap
    const levenshtein = (a, b) => {
        if (a === b) return 0;
        const an = a.length;
        const bn = b.length;
        if (an === 0) return bn;
        if (bn === 0) return an;
        const matrix = Array.from({ length: an + 1 }, () => new Array(bn + 1).fill(0));
        for (let i = 0; i <= an; i++) matrix[i][0] = i;
        for (let j = 0; j <= bn; j++) matrix[0][j] = j;
        for (let i = 1; i <= an; i++) {
            for (let j = 1; j <= bn; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[an][bn];
    };

    const tokenOverlapMatch = (gNorm, aNorm) => {
        const gTokens = gNorm.split(' ').filter(Boolean);
        const aTokens = new Set(aNorm.split(' ').filter(Boolean));
        if (gTokens.length === 0) return false;
        let matched = 0;
        for (const t of gTokens) if (aTokens.has(t)) matched++;
        const ratio = matched / gTokens.length;
        return ratio >= 0.6; // 60% of tokens must match
    };

    const tolerantMatch = (g, a) => {
        const gNorm = normalize(g);
        const aNorm = normalize(a);
        if (!gNorm) return false;
        if (gNorm === aNorm) return true;
        if (aNorm.includes(gNorm) || gNorm.includes(aNorm)) return true;
        if (tokenOverlapMatch(gNorm, aNorm)) return true;
        const maxLen = Math.max(gNorm.length, aNorm.length);
        const distance = levenshtein(gNorm, aNorm);
        const threshold = Math.max(1, Math.floor(maxLen * 0.15)); // allow ~15% chars difference
        if (distance <= threshold) return true;
        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess || !guess.trim()) {
            if (feedback !== 'incorrect' && onAnswer) onAnswer(false);
            setFeedback('incorrect');
            return;
        }
        const isOK = tolerantMatch(guess, answer);
        if (isOK) {
            if (!answered) {
                setAnswered(true);
                if (onAnswer) onAnswer(true);
            }
            setFeedback('correct');
        } else {
            if (feedback !== 'incorrect' && onAnswer) onAnswer(false);
            setFeedback('incorrect');
        }
    };

    const cardClassName = `card ${category ? category.toLowerCase() : ''} ${feedback === 'correct' ? 'feedback-correct' : ''} ${feedback === 'incorrect' ? 'feedback-incorrect' : ''}`;

    return (
        <div className={cardClassName} onClick={handleFlip}>
            <div className="content">
                {!isFlipped && img && <img src={img} alt={question} />}
                <h3>{isFlipped ? answer : question}</h3>
                {!isFlipped && (
                    <form onSubmit={handleSubmit} className="guess-form" onClick={(e) => e.stopPropagation()}>
                        <input
                            id="guess-input"
                            type="text"
                            placeholder="Type your guess here"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            aria-label="Enter your guess"
                        />
                        <button type="submit">Submit Guess</button>
                    </form>
                )}
                {feedback === 'correct' && <div className="feedback-message feedback-message--correct">Correct 🎉</div>}
                {feedback === 'incorrect' && <div className="feedback-message feedback-message--incorrect">Incorrect — try again or flip to see the answer.</div>}
            </div>
            <div className="card-controls" onClick={(e) => e.stopPropagation()}>
                <button className="nav-button" onClick={onPrev} disabled={isFirst} aria-disabled={isFirst}>◀ Prev</button>
                <button className="flip-button" onClick={handleFlip} aria-pressed={isFlipped}>{isFlipped ? 'Hide Answer' : 'Show Answer'}</button>
                <button className="nav-button" onClick={onNext} disabled={isLast} aria-disabled={isLast}>Next ▶</button>
                {typeof onMaster === 'function' && (
                    <button type="button" className="master-button" onClick={() => { if (onMaster) onMaster(); }} aria-label="Mark as mastered">Master ✓</button>
                )}
            </div>
        </div>
    );
}

export default Card;