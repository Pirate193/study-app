import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/authStore'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const Signup = () => {
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [error,seterror]=useState('')
    const [password,setPassword]=useState('')
    const [passworderror,setPassworderror]=useState('')
    const [confirmpassword,setconfirmpassword]=useState('')
    const[showpassword,setshowpassword]=useState(false)
    const {isLoading,signUp,signInWithGoogle}=useAuthStore()
    const router = useRouter()

    const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

    const handleSignup=async()=>{
    if(!name){
        seterror('name is required')
        return
    }
    if(!email){
        seterror("email is required")
        return
    }
    if(!validateEmail(email)){
        seterror('invalid email')
        return
    }
    if(password.length < 8){
        setPassworderror('password must be at least 8 characters ')
        return
    }
    if(password!==confirmpassword){
        seterror("password dont match ")
        return 
    }
    try{
        await signUp(email,password,name)
    }catch(error:any){
        Alert.alert('sign up error',error.message)
    }
        
    }

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.form}>

                <View style={styles.inputcontainer}>
                   <Text style={styles.label} >username</Text>
                   <TextInput
                    style={styles.input}
                    placeholder='nigga'
                    value={name}
                    onChangeText={setName}
                   />
                </View>

                <View style={styles.inputcontainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                    style={styles.input}
                    placeholder='example@gmail.com'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoComplete='email'
                    />
                </View>

                <View style={styles.inputcontainer}>
                    <Text style={styles.label}>password</Text>
                    <View style={styles.passwordcontainer}>
                        <TextInput 
                    style={styles.input}
                    placeholder='********'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showpassword}
                    autoComplete='password'
                    />
                    <TouchableOpacity 
                    onPress={()=>setshowpassword(!showpassword)}
                    style={styles.eyebutton}
                    >
                        <Ionicons 
                        name={showpassword?"eye-off":"eye"}
                        size={20}
                        color='#666'
                        />
                    </TouchableOpacity>
                    </View>
                    
                    {passworderror?<Text style={styles.error}>{passworderror} </Text>:null}
                </View>

                 <View style={styles.inputcontainer}>
                    <Text style={styles.label}>confirm password</Text>
                    <View style={styles.passwordcontainer}>
                        <TextInput 
                    style={styles.input}
                    placeholder='********'
                    value={confirmpassword}
                    onChangeText={setconfirmpassword}
                    secureTextEntry={!showpassword}
                    autoComplete='password'
                    />
                    <TouchableOpacity 
                    onPress={()=>setshowpassword(!showpassword)}
                    style={styles.eyebutton}
                    >
                        <Ionicons 
                        name={showpassword?"eye-off":"eye"}
                        size={20}
                        color='#666'
                        />
                    </TouchableOpacity>
                    </View>
                    
                    {passworderror?<Text>{passworderror} </Text>:null}
                </View>

                {error?<Text style={styles.error} >{error} </Text>: null }
                
               <TouchableOpacity
               style={styles.signupbutton}
               disabled={isLoading}
               onPress={handleSignup}
               >
                <Text style={styles.text}>
                    {isLoading?'creating account':'Register'}
                </Text>

               </TouchableOpacity>

            <View style={styles.logincontainer}>
              <Text style={styles.logintext}>Have an Account? </Text>
              <Link href='/(auth)/signin' style={styles.link}>
                Sign in here
              </Link>
            </View>

              </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Signup

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    form:{
        paddingHorizontal:20,
    },
    inputcontainer:{
        marginBottom:20,
    },
    input:{
        width:'100%',
        height:50,
        borderWidth:1,
        borderColor:'#e5e7eb',
        borderRadius:8,
        paddingHorizontal:15,
        marginBottom:15,
        fontSize:16,
        backgroundColor:'#fff'
    },
    label:{
        fontSize:14,
        fontWeight:'500',
        color:'#374151',
       
    },
    error:{
        color:'#ef4444',
        fontSize:12,
        marginBottom:5,
        marginLeft:2
    },
    passwordcontainer:{
        position:'relative'
    },

    eyebutton:{
        position: 'absolute',
        right: 15,
        top: 15,
        padding: 5,
    },
    signupbutton:{
        width: '100%',
    height: 50,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    },
    text:{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logincontainer:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    link:{
        fontSize: 14,
        color: '#2563eb',
       fontWeight: '500',
    },
    logintext:{
        fontSize: 14,
        color: '#6b7280',
    }
})