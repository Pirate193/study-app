import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session, User } from '@supabase/supabase-js'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
    user: User | null
    session: Session | null
    isLoading: boolean
    isInitialized: boolean
    signUp: (email: string, password: string, userName: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
    initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isLoading: false,
            isInitialized: false,

            signUp: async (email: string, password: string, userName: string) => {
                try {
                    set({ isLoading: true })
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                user_name: userName,
                            },
                        },
                    })
                    if (error) throw error

                    const { data: sessionData } = await supabase.auth.getSession()
                    set({
                        user: sessionData.session?.user ?? null,
                        session: sessionData.session ?? null,
                    })
                } catch (error) {
                    console.error('sign up error: ', error)
                    throw error
                } finally {
                    set({ isLoading: false })
                }
            },

            signIn: async (email: string, password: string) => {
                try {
                    set({ isLoading: true })
                    const { error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })
                    if (error) throw error
                    const { data: sessionData } = await supabase.auth.getSession()
                    set({
                        user: sessionData.session?.user ?? null,
                        session: sessionData.session ?? null,
                    })
                } catch (error) {
                    console.error("sign in error :", error)
                    throw error
                } finally {
                    set({ isLoading: false })
                }
            },

            signInWithGoogle: async () => {
                try {
                    set({ isLoading: true })
                    const redirectTo = AuthSession.makeRedirectUri({})
                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {},
                    })
                    if (error) throw error
                    if (data.url) {
                        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
                        if (result.type === 'success') {
                            const url = result.url
                            const params = new URLSearchParams(url.split('#')[1])
                            const accessToken = params.get('access_token')
                            const refreshToken = params.get('refresh_token')
                            if (accessToken) {
                                const { error: sessionError } = await supabase.auth.setSession({
                                    access_token: accessToken,
                                    refresh_token: refreshToken || '',
                                })
                                if (sessionError) throw sessionError
                            }
                        }
                    }
                } catch (error) {
                    console.error('google sign in error:', error)
                    throw error
                } finally {
                    set({ isLoading: false })
                }
            },

            signOut: async () => {
                try {
                    set({ isLoading: true })
                    const { error } = await supabase.auth.signOut()
                    if (error) throw error
                    set({ user: null, session: null })
                } catch (error) {
                    console.error('sign out error :', error)
                    throw error
                } finally {
                    set({ isLoading: false })
                }
            },

            initialize: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    set({
                        session,
                        user: session?.user ?? null,
                        isInitialized: true,
                    })
                    // listen for auth changes 
                    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
                        set({
                            session,
                            user: session?.user ?? null,
                        })
                    })
                } catch (error) {
                    console.error('initialize error:', error)
                    set({ isInitialized: true })
                }
            },
        }),
        {
            name:'auth-storage',
            storage:createJSONStorage(()=>AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                isInitialized: state.isInitialized,
            }),
        }
    )
)