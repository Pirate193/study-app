import {create} from 'zustand'
import { supabase } from '@/lib/supabase'
import {User,Session} from '@supabase/supabase-js'

interface AuthState {
    user:User| null
    session: Session | null
    isLoading:boolean
    isInitialized:boolean
    signUp:(email:string,password: string) =>Promise<void>
    signIn:(email:string,password: string) =>Promise<void>
    signOut:()=>Promise<void>
    initialize:()=>Promise<void>
}

export const useAuthStore = create<AuthState>((set,get)=>({
    user:null,
    session:null,
    isLoading:false,
    isInitialized:false,

    signUp: async(email:string,password:string)=>{
    try{
        set({isLoading:true})
        const {error} = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
    }catch(error){
        console.error('sign up error: ',error)
        throw error
    }finally{
        set({isLoading:false})
    }
    },
    //signin the user
    signIn: async(email:string,password:string)=>{
        try{
            set({isLoading:true})
            const {error}= await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if(error)throw error
        }catch(error){
            console.error("sign in error :",error)
            throw error
        }finally{
            set({isLoading:false})
        }

    },
    //signout the user
    signOut:async()=>{
        try{
            set({isLoading:true})
            const{error}= await supabase.auth.signOut()
            if (error) throw error
        }catch(error){
            console.error('sign out errror :', error)
            throw error
        }finally{
            set({isLoading:false})
        }
    },
    initialize:async()=>{
        try{
            const {data:{session}}= await supabase.auth.getSession()
            set({
                session,
                user:session?.user ?? null,
                isInitialized:true,
            })
            //listen for auth changes 
            supabase.auth.onAuthStateChange((_event,session)=>{
                set({
                    session,
                    user: session?.user ??null,
                })
            })
        }catch(error){
            console.error('initialize error:',error)
            set({isInitialized:true})
        }
    },
}))