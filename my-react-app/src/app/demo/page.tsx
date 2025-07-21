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
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [matched, setMatched] = useState({});
  const [feedback, setFeedback] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showStartPopup, setShowStartPopup] = useState(true);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [category, setCategory] = useState(null);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState(new Set());

  const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (!category) return;
    const currentPairs = allCategories[category];
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

  const handleSelectAnswer = (answer) => {
    if (!selectedQuestion) return;
    const correctAnswer = questionList.find((pair) => pair.question === selectedQuestion)?.answer;
    if (matched[selectedQuestion]) return;

    if (answer === correctAnswer) {
      setMatched((prev) => ({ ...prev, [selectedQuestion]: answer }));
      setFeedback((prev) => ({ ...prev, [selectedQuestion]: "correct" }));
      setCorrectCount((count) => count + 1);
      setWrongAnswers(prev => {
        const newSet = new Set(prev);
        newSet.delete(answer);
        return newSet;
      });
    } else {
      setFeedback((prev) => ({ ...prev, [selectedQuestion]: "wrong" }));
      setWrongCount((count) => count + 1);
      setWrongAnswers(prev => new Set(prev).add(answer));
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
    const nextIndex = (keys.indexOf(category) + 1) % keys.length;
    const nextCategory = keys[nextIndex];
    setCategory(nextCategory);
    setMatched({});
    setFeedback({});
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswers(new Set());
    const nextPairs = allCategories[nextCategory];
    setQuestionList(shuffle(nextPairs));
    setAnswerList(shuffle(nextPairs.map((pair) => pair.answer)));
    setStartTime(Date.now());
    setEndTime(null);
    setShowEndPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Progress bar */}
      {category && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-800/50 backdrop-blur-sm z-40">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: ${(Object.keys(matched).length / questionList.length) * 100}% }}
          ></div>
        </div>
      )}

      {/* Sidebar */}
      {category && (
        <div className="fixed top-0 left-0 bg-black/20 backdrop-blur-xl border-r border-gray-700/50 h-full w-72 z-30">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">日</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Categories
              </h3>
            </div>
            
            <div className="space-y-3">
              {Object.keys(allCategories).map((cat) => (
                <button
                  key={cat}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 text-left font-medium capitalize
                    ${cat === category 
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/20" 
                      : "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/50 text-gray-300 hover:text-white"
                    }`}
                  onClick={() => setCategory(cat)}
                >
                  <div className="flex items-center gap-3">
                    <div className={w-2 h-2 rounded-full ${cat === category ? "bg-purple-400" : "bg-gray-500"}}></div>
                    {cat}
                  </div>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-2">Current Session</div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">✓ {correctCount}</span>
                <span className="text-red-400">✗ {wrongCount}</span>
                <span className="text-blue-400">{getAccuracy()}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={${category ? 'ml-72' : ''} min-h-screen flex items-center justify-center p-6 relative z-10 pb-24}>
        <div className="w-full max-w-7xl">
          {category && (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Match the Words
                </h1>
                <p className="text-gray-400 text-base capitalize">Category: <span className="text-purple-400 font-semibold">{category}</span></p>
              </div>

              {/* Game grid */}
              <div className="grid grid-cols-2 gap-6 h-[60vh]">
                {/* Japanese words */}
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    日本語 (Japanese)
                  </h2>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {questionList.map((pair, index) => (
                      <button
                        key={pair.question}
                        onClick={() => setSelectedQuestion(pair.question)}
                        disabled={matched[pair.question]}
                        className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 font-medium text-base border backdrop-blur-sm h-16 min-h-16
                          ${matched[pair.question] 
                            ? "bg-green-500/10 border-green-500/30 text-green-300 cursor-not-allowed opacity-60" 
                            : selectedQuestion === pair.question 
                              ? "bg-purple-500/20 border-purple-400/50 text-white shadow-lg shadow-purple-500/20 transform scale-[1.02]" 
                              : "bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/50 hover:scale-102 text-gray-100"
                          }`}
                        style={{ animationDelay: ${index * 100}ms }}
                      >
                        <div className="flex items-center justify-between h-full">
                          <span className="text-xl">{pair.question}</span>
                          {matched[pair.question] && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          {selectedQuestion === pair.question && !matched[pair.question] && (
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* English meanings */}
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    English
                  </h2>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {answerList.map((answer, index) => {
                      const isMatched = Object.values(matched).includes(answer);
                      const isWrongAnswer = wrongAnswers.has(answer);
                      
                      return (
                        <button
                          key={answer}
                          onClick={() => handleSelectAnswer(answer)}
                          disabled={isMatched}
                          className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 font-medium text-base border backdrop-blur-sm h-16 min-h-16
                            ${isMatched 
                              ? "bg-green-500/10 border-green-500/30 text-green-300 cursor-not-allowed opacity-60" 
                              : isWrongAnswer 
                                ? "bg-red-500/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20 animate-pulse" 
                                : "bg-gray-800/30 border-gray-700/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:scale-102 text-gray-100 hover:text-blue-300"
                            }`}
                          style={{ animationDelay: ${index * 100}ms }}
                        >
                          <div className="flex items-center justify-between h-full">
                            <span className="text-base">{answer}</span>
                            {isMatched && (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            {isWrongAnswer && (
                              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✗</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {category && (
        <div className="fixed bottom-6 right-6 flex gap-3 z-40">
          <button 
            onClick={resetGame} 
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 backdrop-blur-sm text-sm"
          >
            🔄 Reset
          </button>
          <button 
            onClick={handleNext} 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm text-sm"
          >
            ➡ Next
          </button>
        </div>
      )}

      {/* Start popup */}
      {showStartPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 p-10 rounded-3xl text-center shadow-2xl max-w-md mx-4 backdrop-blur-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold">日</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Match the Words
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Test your Japanese vocabulary by matching Japanese words with their English meanings.
            </p>
            <button 
              onClick={() => { setShowStartPopup(false); setShowCategoryPopup(true); }} 
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Get Started ✨
            </button>
          </div>
        </div>
      )}

      {/* Category selection popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 p-8 rounded-3xl shadow-2xl w-96 mx-4 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Choose Category
            </h2>
            <div className="space-y-3">
              {Object.keys(allCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowCategoryPopup(false); }}
                  className="w-full bg-gray-800/50 border border-gray-700/50 text-white py-3 px-6 rounded-xl font-medium capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/30 hover:scale-102"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completion popup */}
      {showEndPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 p-8 rounded-3xl text-center shadow-2xl max-w-md mx-4 backdrop-blur-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Excellent Work!
            </h2>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center py-2 px-4 bg-gray-800/50 rounded-xl">
                <span className="text-gray-400">Time</span>
                <span className="text-purple-400 font-semibold">{formatTime(endTime - startTime)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-gray-800/50 rounded-xl">
                <span className="text-gray-400">Correct</span>
                <span className="text-green-400 font-semibold">{correctCount}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-gray-800/50 rounded-xl">
                <span className="text-gray-400">Wrong</span>
                <span className="text-red-400 font-semibold">{wrongCount}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
                <span className="text-gray-300 font-medium">Accuracy</span>
                <span className="text-blue-400 font-bold text-xl">{getAccuracy()}%</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={resetGame} 
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                🔄 Retry
              </button>
              <button 
                onClick={handleNext} 
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                ➡ Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}