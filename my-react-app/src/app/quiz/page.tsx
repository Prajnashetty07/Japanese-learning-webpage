"use client";
import { useState } from "react";

// ✅ Corrected Quiz Data
const quizData = [
  {
    question: "こんにちは Konnichiwa",
    correctAnswer: "Hello",
    options: ["Goodbye", "Thank you", "Hello", "Good night"]
  },
  {
    question: "おはよう Ohayou",
    correctAnswer: "Good morning",
    options: ["Good morning", "Water", "Fish", "Doctor"]
  },
  {
    question: "先生 Sensei",
    correctAnswer: "Teacher",
    options: ["Nurse", "Teacher", "Police officer", "Driver"]
  },
  {
    question: "水 Mizu",
    correctAnswer: "Water",
    options: ["Juice", "Tea", "Rice", "Water"]
  },
  {
    question: "左 Hidari",
    correctAnswer: "Left",
    options: ["Right", "Back", "Left", "Up"]
  },
  {
    question: "こんばんは Konbanwa",
    correctAnswer: "Good evening",
    options: ["Wallet", "Shoes", "Good evening", "Pillow"]
  },
  {
    question: "さようなら Sayounara",
    correctAnswer: "Goodbye",
    options: ["College student", "TV", "Ramen", "Goodbye"]
  },
  {
    question: "ありがとう Arigatou",
    correctAnswer: "Thank you",
    options: ["Clock", "Thank you", "Kitchen", "Tomorrow"]
  },
  {
    question: "医者 Isha",
    correctAnswer: "Doctor",
    options: ["Train", "Doctor", "TV", "Cat"]
  },
  {
    question: "警察官 Keisatsukan",
    correctAnswer: "Police officer",
    options: ["Police officer", "Dinner", "Yesterday", "Dog"]
  }
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizData[current];

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < quizData.length) {
        setCurrent((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/Background.jpg')" }}
      />

      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl p-10 w-full max-w-lg text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Japanese Quiz</h1>

          {showResult ? (
            <div className="text-center">
              <p className="text-xl mb-4">
                You scored <span className="text-blue-400">{score}</span> out of{" "}
                {quizData.length}
              </p>
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-lg text-gray-300 mb-2">
                  Question {current + 1} of {quizData.length}
                </p>
                <div className="text-4xl font-semibold text-center mb-4">
                  {currentQuestion.question}
                </div>
              </div>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isCorrect = selected && option === currentQuestion.correctAnswer;
                  const isWrong = selected === option && option !== currentQuestion.correctAnswer;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className={`w-full px-4 py-3 rounded-xl transition font-medium border border-white/20 ${
                        selected
                          ? isCorrect
                            ? "bg-green-600"
                            : isWrong
                            ? "bg-red-600"
                            : "bg-gray-700"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                      disabled={!!selected}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
