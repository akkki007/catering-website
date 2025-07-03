"use client"

import React, { useEffect } from 'react'
import { getFirestore, collection, getDocs, DocumentData } from 'firebase/firestore'
import { app } from '@/lib/firebase'

const firestore = getFirestore(app)

const Page: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, "Home"))
      querySnapshot.forEach((doc: DocumentData) => {
        console.log(`${doc.id} =>`, doc.data())
      })
    }
    fetchData()
  }, [])

  return (
    <div>page</div>
  )
}

export default Page