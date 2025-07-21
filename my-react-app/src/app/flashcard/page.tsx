"use client";
import React, { useState, useEffect } from "react";

type Pair = {
  question: string;
  answer: string;
};

const originalPairs: Pair[] = [
  { question: "こんにちは", answer: "Hello" },
  { question: "さようなら", answer: "Goodbye" },
  { question: "ありがとう", answer: "Thank you" },
  { question: "おはよう", answer: "Good morning" },
  { question: "こんばんは", answer: "Good evening" },
];

export default function MatchTheFollowing() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [matched, setMatched] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: "correct" | "wrong" | null }>({});
  const [lastAnswerStatus, setLastAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    const shuffledPairs = [...originalPairs].sort(() => Math.random() - 0.5);
    setPairs(shuffledPairs);
    setAnswers([...shuffledPairs.map((p) => p.answer)].sort(() => Math.random() - 0.5));
  }, []);

  const handleSelectAnswer = (answer: string) => {
    if (!selectedQuestion) return;
    const correctAnswer = pairs.find((pair) => pair.question === selectedQuestion)?.answer;
    if (!correctAnswer || matched[selectedQuestion]) return;

    if (!startTime) setStartTime(Date.now());

    if (answer === correctAnswer) {
      setMatched((prev) => ({ ...prev, [selectedQuestion]: answer }));
      setFeedback((prev) => ({ ...prev, [selectedQuestion]: "correct" }));
      setLastAnswerStatus("correct");
      setCorrectCount((count) => count + 1);
    } else {
      setFeedback((prev) => ({ ...prev, [selectedQuestion]: "wrong" }));
      setLastAnswerStatus("wrong");
      setWrongCount((count) => count + 1);
    }

    setSelectedQuestion(null);
  };

  useEffect(() => {
    if (Object.keys(matched).length === pairs.length && startTime && !endTime) {
      setEndTime(Date.now());
    }
  }, [matched, pairs.length, startTime, endTime]);

  const resetGame = () => {
    const shuffledPairs = [...originalPairs].sort(() => Math.random() - 0.5);
    setPairs(shuffledPairs);
    setAnswers([...shuffledPairs.map((p) => p.answer)].sort(() => Math.random() - 0.5));
    setMatched({});
    setFeedback({});
    setSelectedQuestion(null);
    setLastAnswerStatus(null);
    setStartTime(null);
    setEndTime(null);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const getBackgroundClass = () => {
    if (lastAnswerStatus === "correct") {
      return "bg-gradient-to-br from-green-400 via-emerald-400 to-lime-300";
    } else if (lastAnswerStatus === "wrong") {
      return "bg-gradient-to-br from-gray-800 via-red-900 to-black";
    } else {
      return "bg-gradient-to-r from-[#000000] via-[#08E8E8] to-[#000000]";
    }
  };

  const renderScore = () => {
    if (!endTime || !startTime) return null;
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? ((correctCount / totalAttempts) * 100).toFixed(1) : "0";

    return (
      <div className="mt-6 p-4 bg-black/80 border border-white rounded-xl text-white text-center space-y-2">
        <h3 className="text-xl font-bold">🎯 Task Completed!</h3>
        <p>⏱️ Time Taken: <strong>{timeTaken} seconds</strong></p>
        <p>✅ Correct: {correctCount}</p>
        <p>❌ Wrong: {wrongCount}</p>
        <p>📊 Performance Accuracy: <strong>{accuracy}%</strong></p>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} flex flex-col items-center justify-center p-6 transition-all duration-500`}>
      <div className="bg-black shadow-2xl rounded-xl p-8 w-full max-w-5xl grid grid-cols-2 gap-8 relative border-4 border-white">
        <button
          onClick={resetGame}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Reset
        </button>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Japanese Words</h2>
          {pairs.map((pair) => {
            const isMatched = matched[pair.question];
            return (
              <button
                key={pair.question}
                onClick={() => setSelectedQuestion(pair.question)}
                disabled={isMatched}
                className={`w-full text-left px-4 py-2 rounded-lg text-lg font-semibold border transition
                  ${
                    selectedQuestion === pair.question
                      ? "bg-[#08E8E8] border-white text-black"
                      : isMatched
                      ? "bg-transparent text-transparent border-gray-500"
                      : "bg-black text-white border-white hover:bg-[#08E8E8] hover:text-black"
                  }`}
              >
                {pair.question}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">English Meanings</h2>
          {answers.map((answer) => {
            const matchedQuestion = Object.keys(matched).find((q) => matched[q] === answer);
            const isMatched = matchedQuestion !== undefined;

            return (
              <button
                key={answer}
                onClick={() => handleSelectAnswer(answer)}
                disabled={isMatched}
                className={`w-full px-4 py-2 rounded-lg text-lg font-semibold border transition
                  ${
                    isMatched
                      ? "bg-transparent text-transparent border-gray-600 cursor-not-allowed"
                      : "bg-black text-white border-white hover:bg-[#08E8E8] hover:text-black"
                  }`}
              >
                {answer}
              </button>
            );
          })}
        </div>
      </div>
      {renderScore()}
    </div>
  );
}
