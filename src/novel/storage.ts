import AsyncStorage from '@react-native-async-storage/async-storage'

export type VoteStatus = 'none' | 'pending' | 'sent'

export type SaveData = {
  schema: 2
  inkState: string
  contentVersion: string | null
  currentBg: string | null
  finalChoice: 'A' | 'B' | null
  voteStatus: VoteStatus
  dark: boolean
  act: number | null
}

export type Completed = {
  choice: 'A' | 'B'
}

export type Settings = {
  volume: number
}

export const DEFAULT_SETTINGS: Settings = { volume: 50 }

const SAVE_KEY = 'tomorrow-i-promise.save'
const COMPLETED_KEY = 'tomorrow-i-promise.completed'
const SETTINGS_KEY = 'tomorrow-i-promise.settings'

export async function loadSave() : Promise<SaveData | null> {
  try {
    const save = await AsyncStorage.getItem(SAVE_KEY)

    if (save === null) {
      return null
    }

    const saveData = JSON.parse(save)
    if ((saveData.schema !== 1 && saveData.schema !== 2) || typeof saveData.inkState !== 'string') {
      return null
    }
    return {
      ...saveData,
      schema: 2,
      dark: saveData.dark === true,
      act: typeof saveData.act === 'number' ? saveData.act : null,
    } as SaveData
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

export async function loadCompleted() : Promise<Completed | null> {
  try {
    const completed = await AsyncStorage.getItem(COMPLETED_KEY)
    if (completed === null) {
      return null
    }
    const data = JSON.parse(completed)
    if (data.choice !== 'A' && data.choice !== 'B') {
      return null
    }
    return { choice: data.choice }
  } catch (error) {
    console.warn('loadCompleted failed', error)
    return null
  }
}

export async function markCompleted(choice: 'A' | 'B') : Promise<void> {
  try {
    if (await loadCompleted() !== null) {
      return
    }
    await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify({ choice }))
  } catch (error) {
    console.warn('markCompleted failed', error)
  }
}

export async function loadSettings() : Promise<Settings> {
  try {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY)
    if (settings === null) {
      return DEFAULT_SETTINGS
    }
    const data = JSON.parse(settings)
    if (typeof data.volume !== 'number' || !Number.isFinite(data.volume)) {
      return DEFAULT_SETTINGS
    }
    return { volume: Math.min(100, Math.max(0, Math.round(data.volume))) }
  } catch (error) {
    console.warn('loadSettings failed', error)
    return DEFAULT_SETTINGS
  }
}

export async function writeSettings(settings: Settings) : Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('writeSettings failed', error)
  }
}
