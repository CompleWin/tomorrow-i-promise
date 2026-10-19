import AsyncStorage from '@react-native-async-storage/async-storage'

export type VoteStatus = 'none' | 'pending' | 'sent'

export type SaveData = {
  schema: 1
  inkState: string
  contentVersion: string | null
  currentBg: string | null
  finalChoice: 'A' | 'B' | null
  voteStatus: VoteStatus
}

const SAVE_KEY = 'windturbine.save'

export async function loadSave() : Promise<SaveData | null> {
  try {
    const save = await AsyncStorage.getItem(SAVE_KEY)

    if (save === null) {
      return null
    }

    const saveData = JSON.parse(save)
    if (saveData.schema !== 1 || typeof saveData.inkState !== 'string') {
      return null
    }
    return saveData as SaveData
  } catch (error) {
    console.warn('loadSave failed', error)
    return null
  }
}

export async function writeSave(save: SaveData) : Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch (error) {
    console.warn('writeSave failed', error)
  }
}

export async function clearSave() : Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVE_KEY)
  } catch (error) {
    console.warn('clearSave failed', error)
  }
}