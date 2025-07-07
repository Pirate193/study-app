import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

const Signin = () => {
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[showpassword,setshowpassword]=useState(false)
    const[keepsignedin,setkeepsignedin]=useState(false)
    const[emailError,setEmailError]=useState('')
    const[passwordError,setPasswordError]=useState('')
    const {signIn,isLoading,signInWithGoogle}=useAuthStore()
   const router = useRouter()
    
   const validateEmail=(email:string)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
   }
    const handleLogin = async()=>{
        setEmailError('')
        setPasswordError('')
        
        if(!email){
            setEmailError('email is required ')
            return
        }
        if(!validateEmail(email)){
            setEmailError('please enter a valid email')
         return
        }
        if(!password){
            setPasswordError('password is required')
            return
        }
        try{
            await signIn(email,password)
            router.replace('/(tabs)')
        }catch(error:any){
            if(error.message.includes('invalid login credentials')){
                setPasswordError('Invalid email or password')
            }else{
            Alert.alert("login error ", error.message)
            }
        }
    }
    const handleGooglesignin = async ()=>{
        try{
            await signInWithGoogle()
        }catch (error:any){
            Alert.alert('google sign in error ', error.message)
        }
    }
  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}
        style={styles.keyboardavoid} >
        <ScrollView showsVerticalScrollIndicator={false} >
         <View style={styles.form}>
            <View style={styles.inputcontainer} >
                <Text style={styles.label} >email address</Text>
                <TextInput
                style={[styles.input,emailError? styles.inputerror:null]}
                placeholder='example@gmail.com'
                value={email}
                onChangeText={(text)=>{
                    setEmail(text)
                    setEmailError('')
                }}
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
                />
                {emailError?<Text style={styles.errorText}>{emailError} </Text> : null}
            </View>

            <View style={styles.passwordcontainer} > 
             <Text style={styles.label} >password</Text>
             <TextInput 
            style={styles.input}
            placeholder='••••••••'
            value={password}
            onChangeText={(text)=>{
                setPassword(text)
                setPasswordError('')
            }}
            secureTextEntry={!showpassword}
            autoComplete='password'
            />
             <TouchableOpacity
            style={styles.eyeButton}
            onPress={()=>setshowpassword(!showpassword)}
             >
             <Ionicons 
             name={showpassword? "eye-off":"eye"}
             size={20}
             color="#666"
             />
             </TouchableOpacity>
             {passwordError?<Text style={styles.errorText} >{passwordError} </Text>:null }
            </View>
          
        <TouchableOpacity
         style={styles.loginbutton}
         onPress={handleLogin}
         disabled={isLoading}
         >
         <Text style={styles.loginbuttontext} >
            { isLoading? 'logging in...': 'Login'}
         </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign in with</Text>
              <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
        style={styles.googlebutton}
        onPress={handleGooglesignin}
        disabled={isLoading}
        >
       <Ionicons name="logo-google" size={20} color="#4285f4" >
         <Text style={styles.googlebuttontext} > sign in with Google</Text>
       </Ionicons>
        </TouchableOpacity>

        <View style={styles.signupcontainer}>
         <Text style={styles.signuptext} >Dont have an account</Text>
         <Link href='/(auth)/signup' style={styles.link}>Sign up here</Link>
        </View>

         </View>         
        </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
    
  )
}

export default Signin

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        
    },
    form:{
        paddingHorizontal:20,
    },
    inputcontainer:{
        marginBottom:20,
    },
    label:{
        fontSize:14,
        fontWeight:'500',
        color:'#374151',
        marginBottom:8
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
    inputerror:{
        borderColor:'#ef4444',
    },
    passwordcontainer:{
      position:'relative'
    },
    errorText:{
        color:'#ef4444',
        fontSize:12,
        marginLeft:2
    },
    eyeButton:{position:'absolute',
        right:15,
        top:40,
        padding:5
    },
    loginbutton:{
       width:'100%',
       height:50,
       backgroundColor:'#2563eb',
       borderRadius:15,
       justifyContent:'center',
       alignItems:'center',
       marginBottom:30,
    },
    loginbuttontext:{
        color:'#fff',
        fontSize:16,
        fontWeight:'600'
    },
    divider:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:20,
    },
    dividerLine:{
        flex:1,
        height:1,
        backgroundColor:'#e5e7eb'
    },
    dividerText:{
        marginHorizontal:15,
        fontSize:14,
        color:'#6b7280'
    },
    googlebutton:{
      width:'100%',
      height:50,
      backgroundColor:'#fff',
      borderWidth:1,
      borderColor:'#e5e7eb',
      borderRadius:8,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      marginBottom:30,
    },
    googlebuttontext:{
        color:'#374151',
        fontSize:16,
        fontWeight:'500',
        marginLeft:10,
    },
    signupcontainer:{
       flexDirection:'row',
       justifyContent:'center',
       alignItems:'center',
    },
    signuptext:{
       fontSize:14,
       color:'#6b7280'
    },
    link:{
        color:'#007AFF',
        textDecorationLine:'underline',
        fontWeight:'500'
    },
    buttontext:{
        color:'#fff',
        fontSize:16,
        
    },
    keyboardavoid:{

    }
})