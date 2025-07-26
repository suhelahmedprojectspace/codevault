'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { matchingQuestions } from '@/constants/Questionair';
import { Button } from './ui/button';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { ChevronRight, Loader2, CheckCircle } from 'lucide-react'; // Added new icons
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface QuestionProps {
  onComplete?: () => void;
}

const Question = ({ onComplete }: QuestionProps) => {
  const router = useRouter();
  // const [hasMatchingPreferences, setHasMatchingPreferences] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<{ [key: string]: string | string[] }>({});
  const [direction, setDirection] = useState(1);
  const currentQuestion = matchingQuestions[currentIndex];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New state for success animation
  const isCurrentAnswered = Boolean(answer[currentQuestion.id]);

  const handleChange = (questionId: string, value: string, isCheckbox: boolean) => {
    setAnswer((prev) => {
      if (isCheckbox) {
        const prevArr = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
        const updatedArr = prevArr.includes(value)
          ? prevArr.filter((v) => v !== value)
          : [...prevArr, value];
        return { ...prev, [questionId]: updatedArr };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  const handleNext = () => {
    setDirection(1);
    if (currentIndex !== matchingQuestions.length - 1) {
      setCurrentIndex((prev) => Math.min(prev + 1, matchingQuestions.length - 1));
    } else {
      setIsSubmitting(true);
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      const res = await axios.patch('/codebuddy', answer);
      console.log(res);
      if (res.status === 200) {
        toast.success('Answers submitted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/recommedation');
        }, 2000);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Something went Wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const variants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      position: 'absolute',
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative',
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      position: 'absolute',
    }),
  };

  const progress = ((currentIndex + 1) / matchingQuestions.length) * 100;

  // useEffect(()=>{
  //     const fetchData=async()=>{
  //       try {
  //         const res=await axios.get('/porfolio/check');
  //         setHasMatchingPreferences(res.data.hasMatchingPreferences);
  //       } catch (error) {
  //         console.error('Error fetching data:', error)
  //       }
  //     }
  //     fetchData();
  // },[])

  return (
    <div className="flex justify-center items-center mx-auto min-h-screen p-8">
      <Card className="max-w-xl w-full mx-auto overflow-hidden relative">
        <Progress value={progress} className="h-1" />
        <CardHeader>
          <CardTitle className="text-xl font-bold">Find Your Ideal Coding Buddy</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Answer a few quick questions to help us match you with someone who shares your coding
            interests, goals, and working style.
          </CardDescription>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span className="font-medium text-primary">Question {currentIndex + 1}</span>
            <span className="mx-1">of</span>
            <span>{matchingQuestions.length}</span>
          </div>
        </CardHeader>

        <CardContent className="relative min-h-[200px] px-6 py-4">
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500" strokeWidth={1.5} />
                </motion.div>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-gray-800"
                >
                  Finding your perfect match...
                </motion.h3>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                  className="h-1 bg-primary/20 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-primary animate-pulse"
                    style={{ animationDuration: '1.5s' }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="w-full"
            >
              <div>
                <h3 className="font-semibold mb-4 text-xl text-gray-800">
                  {currentQuestion.question}
                </h3>
                <div
                  className={cn('space-y-3 max-h-[280px] pr-2 overflow-y-auto custom-scrollbar')}
                >
                  {currentQuestion.options.map((option, index) => {
                    const inputId = `${currentQuestion.id}-${index}`;
                    const isChecked =
                      currentQuestion.type === 'checkbox'
                        ? (answer[currentQuestion.id] as string[] | undefined)?.includes(option)
                        : answer[currentQuestion.id] === option;
                    return (
                      <label
                        key={option}
                        htmlFor={inputId}
                        className={cn(
                          'flex items-center p-2 rounded-lg border cursor-pointer transition-all',
                          isChecked
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <input
                          type={currentQuestion.type}
                          name={currentQuestion.id}
                          id={inputId}
                          value={option}
                          checked={!!isChecked}
                          onChange={() =>
                            handleChange(
                              currentQuestion.id,
                              option,
                              currentQuestion.type === 'checkbox',
                            )
                          }
                          className="form-checkbox text-blue-600"
                        />
                        <span className="ml-3 text-gray-700 font-semibold">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            variant="default"
            className={cn('gap-1', isSubmitting && 'opacity-75 pointer-events-none')}
          >
            {currentIndex === matchingQuestions.length - 1 ? (
              <>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Question;
