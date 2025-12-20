import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { Quiz, QuizQuestion, useQuizzes } from "@/hooks/useQuizzes";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const { submitQuizResult, getQuizResult } = useQuizzes();
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  const previousResult = getQuizResult(quiz.id);
  const questions = quiz.questions;

  const handleStartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
    setOpen(true);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.correctAnswer) {
          correct++;
        }
      });
      setScore(correct);
      setShowResults(true);
      submitQuizResult(quiz.id, selectedAnswers, correct, questions.length);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/20 text-success border-success/30';
      case 'intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return '';
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{quiz.category}</Badge>
                <Badge variant="outline" className={cn("text-xs capitalize", getDifficultyColor(quiz.difficulty))}>
                  {quiz.difficulty}
                </Badge>
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {quiz.title}
              </h3>
              <p className="text-sm text-muted-foreground">{quiz.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {questions.length} questions
                </span>
                {previousResult && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    Best: {previousResult.score}/{previousResult.total_questions}
                  </Badge>
                )}
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={handleStartQuiz}
              >
                {previousResult ? 'Retake Quiz' : 'Start Quiz'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{quiz.title}</DialogTitle>
          </DialogHeader>
          
          {!showResults ? (
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="font-medium">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">
                  {questions[currentQuestion]?.question}
                </h3>
                
                <div className="space-y-2">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      className={cn(
                        "w-full p-3 text-left rounded-lg border transition-all",
                        selectedAnswers[currentQuestion] === index
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleNext} 
                className="w-full"
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 pt-4 text-center">
              <div className={cn(
                "w-20 h-20 mx-auto rounded-full flex items-center justify-center",
                score >= questions.length * 0.7 ? "bg-success/20" : "bg-warning/20"
              )}>
                <Trophy className={cn(
                  "h-10 w-10",
                  score >= questions.length * 0.7 ? "text-success" : "text-warning"
                )} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold">{score}/{questions.length}</h3>
                <p className="text-muted-foreground">
                  {score >= questions.length * 0.7 
                    ? "Great job! You passed!" 
                    : "Keep learning and try again!"}
                </p>
              </div>
              
              <div className="space-y-2 text-left">
                <p className="text-sm font-medium">Review Answers:</p>
                {questions.map((q, i) => {
                  const isCorrect = selectedAnswers[i] === q.correctAnswer;
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "p-3 rounded-lg text-sm",
                        isCorrect ? "bg-success/10" : "bg-destructive/10"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">{q.question}</p>
                          {!isCorrect && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Correct: {q.options[q.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleStartQuiz} className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={() => setOpen(false)} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
