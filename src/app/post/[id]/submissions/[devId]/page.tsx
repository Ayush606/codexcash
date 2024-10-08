'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Submission from '@/components/ui/submission'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'
import { updateContest, getUserData, getContest } from '@/utilities/appwrite-utils'
import { useToast } from '@/hooks/use-toast'
import { useAppContext } from '@/app/context/AppContext'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"


function SubmissionPage() {
  const params = useParams<{ id: string, devId: string }>()
  const { id, devId } = params
  const [devData, setDevData] = useState({})
  const [winnerData, setWinnerData] = useState({})
  const [contestInfo, setContestInfo] = useState({})
  const [hideDialog, setHideDialog] = useState(false)
  const { accountInfo } = useAppContext();
  const { toast } = useToast()
  useEffect(() => {
    getUserData(devId).then((res) => {
      setDevData(res.documents[0])
      console.log('dev', res)
    }).catch((err) => {
      console.log(err)
    })

    getContest(id).then((res) => {
      setContestInfo(res)
      if (res.winner_id !== "") {
        getUserData(res.winner_id).then((res) => {
          setHideDialog(true)
          setWinnerData(res.documents[0])
        }).catch((err) => {
          console.log(err)
        })
      }
    }).catch((err) => {
      console.log(err)
    })


  }, [devId, id])
  function handleWinnerClick() {

    updateContest(id, devId).then((res) => {
      console.log(res)
      toast({
        title: 'Winner Selected',
        description: `${devData.username} has been selected as the winner`
      })
      setWinnerData(devData)
      setHideDialog(true)
    }).catch((err) => {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      })
      console.log(err)
    })
  }
  return (
    <div className='text-center '>
      <h1 className='font-semibold'>Submission by {devData.username}</h1>
      <p>Here you can see submissions by {devData.username} and can have a private chat with them</p>
      <hr className='border-border' />
      {hideDialog ? (
        <div>
          <div className='flex justify-center w-full max-w-6xl mx-auto my-2 items-center bg-primary rounded-md'>
            <span className='font-bold'>Selected Winner:    </span>
            <span className='font-bold ml-4'>{winnerData.username}</span>
            <Trophy className='w-4 h-4 mx-2' />
          </div>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger className='flex justify-center w-full max-w-6xl mx-auto my-2 items-center bg-primary hover:bg-primary/80 rounded-md p-1'>
            <span >Select as Winner</span>
            <Trophy className='w-4 h-4 mx-2' />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to select {devData.username} as the winner of this contest?</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <DialogTrigger onClick={handleWinnerClick} className='bg-primary hover:bg-primary/80 rounded-md p-1' >Yes, select {devData.username} as the winner</DialogTrigger>
          </DialogContent>
        </Dialog>
      )}
      <Submission />
      <Link className='' href={`/post/${id}/submissions`}>
        <Button className='mt-3 mx-auto'>Back to Submissions</Button>
      </Link>
    </div>
  )
}

export default SubmissionPage