"use client";
import React, { useState, useEffect } from "react";

const allCategories = {
  greetings: [
    { question: "こんにちは", answer: "Hello" },
    { question: "さようなら", answer: "Goodbye" },
    { question: "ありがとう", answer: "Thank you" },
    { question: "おはよう", answer: "Good morning" },
    { question: "こんばんは", answer: "Good evening" },
  ],
  food: [
    { question: "りんご", answer: "Apple" },
    { question: "みず", answer: "Water" },
    { question: "ごはん", answer: "Rice" },
    { question: "さかな", answer: "Fish" },
    { question: "にく", answer: "Meat" },
  ],
  vegetable: [
    { question: "にんじん", answer: "Carrot" },
    { question: "たまねぎ", answer: "Onion" },
    { question: "じゃがいも", answer: "Potato" },
    { question: "キャベツ", answer: "Cabbage" },
    { question: "トマト", answer: "Tomato" },
  ],
  meat: [
    { question: "チキン", answer: "Chicken" },
    { question: "ビーフ", answer: "Beef" },
    { question: "ポーク", answer: "Pork" },
    { question: "マトン", answer: "Mutton" },
    { question: "ターキー", answer: "Turkey" },
  ],
  place: [
    { question: "がっこう", answer: "School" },
    { question: "びょういん", answer: "Hospital" },
    { question: "こうえん", answer: "Park" },
    { question: "えき", answer: "Station" },
    { question: "いえ", answer: "House" },
  ],
  family: [
    { question: "ちち", answer: "Father" },
    { question: "はは", answer: "Mother" },
    { question: "あに", answer: "Older brother" },
    { question: "あね", answer: "Older sister" },
    { question: "いもうと", answer: "Younger sister" },
  ],
  position: [
    { question: "いちばんめ", answer: "First child" },
    { question: "にばんめ", answer: "Second child" },
    { question: "さんばんめ", answer: "Third child" },
    { question: "よんばんめ", answer: "Fourth child" },
    { question: "ごばんめ", answer: "Fifth child" },
  ],
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes > 0 ? `${minutes} min ` : ""}${seconds} sec`.trim();
};

export default function MatchTheFollowing() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [questionList, setQuestionList] = useState<{ question: string; answer: string }[]>([]);
  const [answerList, setAnswerList] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showStartPopup, setShowStartPopup] = useState(true);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [category, setCategory] = useState<keyof typeof allCategories | null>(null);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState(new Set());

  const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (!category) return;
    const currentPairs = allCategories[category as keyof typeof allCategories];
    const shuffledQuestions = shuffle(currentPairs);
    const shuffledAnswers = shuffle(currentPairs.map((pair) => pair.answer));
    setQuestionList(shuffledQuestions);
    setAnswerList(shuffledAnswers);
    setStartTime(Date.now());
  }, [category]);

  useEffect(() => {
    if (Object.keys(matched).length === questionList.length && questionList.length > 0) {
      setEndTime(Date.now());
      setShowEndPopup(true);
    }
  }, [matched, questionList.length]);

  const handleSelectAnswer = (answer: string) => {
    if (!selectedQuestion) return;
    const correctAnswer = questionList.find((pair) => pair.question === selectedQuestion)?.answer;
    if (matched[selectedQuestion]) return;

    if (answer === correctAnswer) {
      setMatched((prev) => ({ ...prev, [selectedQuestion]: answer }));
      setFeedback((prev) => ({ ...prev, [selectedQuestion]: "correct" }));
      setCorrectCount((count) => count + 1);
      // Remove from wrong answers if it was previously wrong
      setWrongAnswers(prev => {
        const newSet = new Set(prev);
        newSet.delete(answer);
        return newSet;
      });
    } else {
      setFeedback((prev) => ({ ...prev, [selectedQuestion]: "wrong" }));
      setWrongCount((count) => count + 1);
      // Add to wrong answers set
      setWrongAnswers(prev => new Set(prev).add(answer));
      // Clear wrong feedback after a short delay
      setTimeout(() => {
        setFeedback((prev) => {
          const newFeedback = { ...prev };
          delete newFeedback[selectedQuestion];
          return newFeedback;
        });
        setWrongAnswers(prev => {
          const newSet = new Set(prev);
          newSet.delete(answer);
          return newSet;
        });
      }, 1000);
    }
    setSelectedQuestion(null);
  };

  const resetGame = () => {
    if (!category) return;
    const currentPairs = allCategories[category];
    setMatched({});
    setFeedback({});
    setSelectedQuestion(null);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswers(new Set());
    setQuestionList(shuffle(currentPairs));
    setAnswerList(shuffle(currentPairs.map((pair) => pair.answer)));
    setStartTime(Date.now());
    setEndTime(null);
    setShowEndPopup(false);
  };

  const getAccuracy = () => {
    const total = correctCount + wrongCount;
    return total === 0 ? 0 : Math.round((correctCount / total) * 100);
  };

  const handleNext = () => {
    const keys = Object.keys(allCategories);
    if (!category) return;
    const nextIndex = (keys.indexOf(category) + 1) % keys.length;
    const nextCategory = keys[nextIndex];
    setCategory(nextCategory as keyof typeof allCategories);
    setMatched({});
    setFeedback({});
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswers(new Set());
    const nextPairs = allCategories[nextCategory as keyof typeof allCategories];
    setQuestionList(shuffle(nextPairs));
    setAnswerList(shuffle(nextPairs.map((pair) => pair.answer)));
    setStartTime(Date.now());
    setEndTime(null);
    setShowEndPopup(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 relative flex">
      {category && (
        <div className="fixed top-0 left-0 bg-gray-900 p-4 h-full w-40">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          {Object.keys(allCategories).map((cat) => (
            <button
              key={cat}
              className={`w-full mb-2 px-2 py-1 rounded ${cat === category ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setCategory(cat as keyof typeof allCategories)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 ml-44 flex items-center justify-center w-full">
        <div className="w-full max-w-5xl grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Japanese Words</h2>
            {questionList.map((pair) => (
              <button
                key={pair.question}
                onClick={() => setSelectedQuestion(pair.question)}
                disabled={!!matched[pair.question]}
                className={`w-full px-4 py-2 rounded-lg text-lg font-medium border mb-2 transition-all duration-300
                ${matched[pair.question] ? "opacity-30 cursor-not-allowed" :
                  selectedQuestion === pair.question ? "bg-blue-100 text-black border-blue-400" : "bg-black border-white hover:bg-gray-800"}`}
              >
                {pair.question}
              </button>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">English Meanings</h2>
            {answerList.map((answer) => {
              const isMatched = Object.values(matched).includes(answer);
              const isWrongAnswer = wrongAnswers.has(answer);
              
              return (
                <button
                  key={answer}
                  onClick={() => handleSelectAnswer(answer)}
                  disabled={isMatched}
                  className={`w-full px-4 py-2 rounded-lg text-lg font-medium border mb-2 transition-all duration-300
                  ${isMatched ? "bg-green-500 border-green-700 opacity-30 cursor-not-allowed" :
                    isWrongAnswer ? "bg-red-500 border-red-700" : "bg-black border-white hover:bg-blue-800"}`}
                >
                  {answer}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-4">
        <button onClick={resetGame} className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600">Reset</button>
        <button onClick={handleNext} className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">Next</button>
      </div>

      {showStartPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-xl text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Match the following - Let's begin!</h2>
            <button onClick={() => { setShowStartPopup(false); setShowCategoryPopup(true); }} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Continue</button>
          </div>
        </div>
      )}

      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-xl text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4">Select a Category</h2>
            {Object.keys(allCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat as keyof typeof allCategories); setShowCategoryPopup(false); }}
                className="block w-full bg-blue-500 text-white my-2 px-4 py-2 rounded hover:bg-blue-600"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {showEndPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl text-center max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Task Completed!</h2>
            <p className="mb-1">
              Time Taken: {(endTime !== null && startTime !== null) ? formatTime(endTime - startTime) : "--"}
            </p>
            <p className="mb-1">Correct: {correctCount} | Wrong: {wrongCount}</p>
            <p className="mb-4">Accuracy: {getAccuracy()}%</p>
            <button onClick={resetGame} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Retry</button>
            <button onClick={handleNext} className="bg-blue-500 text-white ml-4 px-4 py-2 rounded hover:bg-blue-600">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}