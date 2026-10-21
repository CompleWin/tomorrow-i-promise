import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getCount,
  query,
  where,
} from 'firebase/firestore/lite'
import { db, getUid } from '@/novel/firebase'

export type Choice = 'A' | 'B'
export type Results = {
  a: number
  b: number
}

export const LABELS: Record<Choice, string> = {
  A: 'Оставляем',
  B: 'Не оставляем',
}

export const MIN_VOTES = 12

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const TIMEOUT_MS = 8 * 1000

function withTimeout<T> (promise: Promise<T>): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
  })
  return Promise.race([promise, timeout])
}

export async function submitVote (
  choice: Choice, contentVersion: string): Promise<void> {
  const uid = await withTimeout(getUid())
  const ref = doc(db, 'votes', uid)

  const snap = await withTimeout(getDoc(ref))
  if (snap.exists()) {
    return
  }

  await withTimeout(
    setDoc(ref, { choice, contentVersion, createdAt: serverTimestamp() }))
}

export async function submitEmail (email: string): Promise<void> {
  const uid = await withTimeout(getUid())
  await withTimeout(
    setDoc(doc(db, 'emails', uid), { email, createdAt: serverTimestamp() }))
}

export async function getResults (): Promise<Results> {
  const votes = collection(db, 'votes')

  const [a, b] = await Promise.all(
    [
      withTimeout(getCount(query(votes, where('choice', '==', 'A')))),
      withTimeout(getCount(query(votes, where('choice', '==', 'B')))),
    ])
  
  return { a: a.data().count, b: b.data().count }
}