import { supabase } from './supabase'

export interface Password {
  id: string
  site: string
  password: string
  user_id: string
  created_at: string
  updated_at: string
}

export const getPasswords = async (userId: string): Promise<Password[]> => {
  try {
    const { data, error } = await supabase
      .from('passwords')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching passwords:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching passwords:', error)
    return []
  }
}

export const addPassword = async (userId: string, site: string, password: string): Promise<Password | null> => {
  try {
    const { data, error } = await supabase
      .from('passwords')
      .insert([
        {
          user_id: userId,
          site: site,
          password: password
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding password:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error adding password:', error)
    return null
  }
}

export const updatePassword = async (passwordId: string, site: string, password: string): Promise<Password | null> => {
  try {
    const { data, error } = await supabase
      .from('passwords')
      .update({
        site: site,
        password: password,
        updated_at: new Date().toISOString()
      })
      .eq('id', passwordId)
      .select()
      .single()

    if (error) {
      console.error('Error updating password:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating password:', error)
    return null
  }
}

export const deletePassword = async (passwordId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('passwords')
      .delete()
      .eq('id', passwordId)

    if (error) {
      console.error('Error deleting password:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting password:', error)
    return false
  }
}
