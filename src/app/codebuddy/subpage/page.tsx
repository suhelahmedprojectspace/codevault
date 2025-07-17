'use client'

import React, { useEffect, useState } from 'react'
import Questionnaire from '@/components/Question'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RocketIcon, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import axios from '@/lib/axios'

const QuestionPage = () => {
  const router = useRouter()
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null)
  const [showRedirectNotice, setShowRedirectNotice] = useState(false)
  const [redirectProgress, setRedirectProgress] = useState(0)

  useEffect(() => {
    const checkPortfolio = async () => {
      try {
        const res = await axios.get('/porfolio/check')
        const data = await res.data;
        setHasPortfolio(data.hasPortfolio)
     
      } catch (error) {
        console.error('Error checking portfolio:', error)
      }
    }
    checkPortfolio()
  }, [])

  useEffect(() => {
    if (hasPortfolio === false) {
      setShowRedirectNotice(true)
      const timer = setInterval(() => {
        setRedirectProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            router.push('/dashboard/portfolio?returnTo=/question')
            return 100
          }
          return prev + 10
        })
      }, 300)

      return () => clearInterval(timer)
    }
  }, [hasPortfolio, router])

  // if (hasPortfolio === null) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  //     </div>
  //   )
  // }

  if (showRedirectNotice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-md mx-auto">
        <Alert className="mb-8">
          <RocketIcon className="h-5 w-5 text-primary" />
          <AlertTitle>Portfolio Required</AlertTitle>
          <AlertDescription>
            You need to set up your portfolio before taking the questionnaire.
          </AlertDescription>
        </Alert>

        <div className="w-full space-y-2">
          <Progress value={redirectProgress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Redirecting to portfolio setup in {Math.floor((100 - redirectProgress)/10)}s...
          </p>
        </div>

        <Button 
          variant="secondary" 
          className="mt-6"
          onClick={() => router.push('/dashboard/portfolio?returnTo=/question')}
        >
          Go Now
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Questionnaire onComplete={() => {
        router.push('/recommedation')
      }} />
    </div>
  )
}

export default QuestionPage