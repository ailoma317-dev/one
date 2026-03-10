import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  credits: number
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  user_id: string
  product_url: string
  product_title: string | null
  product_description: string | null
  product_price: string | null
  analysis_data: Record<string, unknown>
  credits_used: number
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  price_id: string | null
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  stripe_invoice_id: string | null
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  created_at: string
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },

  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Profile helpers
export const profiles = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data: data as Profile | null, error }
  },

  update: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    return { data: data as Profile | null, error }
  },

  updateCredits: async (userId: string, creditsChange: number) => {
    const { data: profile } = await profiles.get(userId)
    if (!profile) return { data: null, error: new Error('Profile not found') }
    
    const newCredits = Math.max(0, profile.credits + creditsChange)
    return profiles.update(userId, { credits: newCredits })
  },
}

// Reports helpers
export const reports = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data: data as Report[] | null, error }
  },

  getById: async (reportId: string, userId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', userId)
      .single()
    return { data: data as Report | null, error }
  },

  create: async (report: Omit<Report, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single()
    return { data: data as Report | null, error }
  },

  delete: async (reportId: string, userId: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', userId)
    return { error }
  },
}

// Subscriptions helpers
export const subscriptions = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data: data as Subscription | null, error }
  },

  isActive: async (userId: string) => {
    const { data } = await subscriptions.get(userId)
    return data?.status === 'active' || data?.status === 'trialing'
  },
}

// Invoices helpers
export const invoices = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data: data as Invoice[] | null, error }
  },
}

// Edge Functions helpers
export const edgeFunctions = {
  analyzeProduct: async (reportId: string, productUrl: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { data: null, error: new Error('Not authenticated') }
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/analyze-product`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ reportId, productUrl }),
      }
    )

    const result = await response.json()
    
    if (!response.ok || !result.success) {
      return { data: null, error: new Error(result.error || 'Analysis failed') }
    }

    return { data: result.data, error: null }
  },
}

export default supabase
