'use client'
import React, { useEffect, useState } from 'react'
import CodeBuddyIntroPage from './mainpage/page'
import QuestionPage from './subpage/page'
import Question from '@/components/Question'
import { useSession } from 'next-auth/react'
import axios from '@/lib/axios'
import Recommendation from '@/components/Recommendation'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

const Page = () => {
  const { data: session, status } = useSession()
  const [hasPortfolio, setHasPortfolio] = useState(false)
  const [hasMatchingPreferences, setHasMatchingPreferences] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'authenticated') {
          const res = await axios.get('/portfolio/check')
          setHasPortfolio(res.data.hasPortfolio)
          setHasMatchingPreferences(res.data.hasMatchingPreferences)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      fetchData()
    }
  }, [status])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
      <div className='space-y-8 p-6 w-full max-w-2xl '>
        <div className='flex items-center space-x-4'>
           <Skeleton className='h-12 w-12 rounded-full'/>
           <div className='space-y-2'>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />

           </div>
        </div>
        <div className='space-y-6'>
           <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
           <Skeleton className="h-5 w-3/6" />
        </div>
         <div className="flex space-x-4 pt-6">
        <Skeleton className="h-12 w-32 rounded-lg" />
         <Skeleton className="h-12 w-32 rounded-lg" />
      </div>
      </div>
      </div>
    )
      
  }

  if (status === 'unauthenticated') {
    return <CodeBuddyIntroPage />
  }

  if (!hasMatchingPreferences) {
    return <QuestionPage />
  }

  if (!hasPortfolio) {
    return <Question />
  }

  return <Recommendation />
}

export default Page