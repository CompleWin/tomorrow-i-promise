import { initializeApp } from 'firebase/app'
import { getAuth, initializeAuth, getReactNativePersistence, signInAnonymously } from 'firebase/auth'
import { Platform } from 'react-native'
import { getFirestore } from 'firebase/firestore/lite'
import AsyncStorage from '@react-native-async-storage/async-storage'

const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
})

const auth = Platform.OS === 'web' ?
  getAuth() :
  initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })

export const db = getFirestore(app)

export async function getUid() : Promise<string> {
  await auth.authStateReady()

  if (auth.currentUser !== null) {
    return auth.currentUser.uid
  } else {
    const cred = await signInAnonymously(auth)
    return cred.user.uid
  }
}