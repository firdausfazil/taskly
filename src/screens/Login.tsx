import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
//import { setUser } from '../redux/slices/UserAuthSlice'
//import { toggleTheme } from '../redux/slices/themeSlice'
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserIcon, LockClosedIcon } from "react-native-heroicons/outline";
import { Screen } from 'react-native-screens';
import { MMKV } from 'react-native-mmkv';


const Login = ({navigation}: any) => {

  const dispatch = useDispatch();
  const storage = new MMKV()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <View className='flex-1'>
      <SafeAreaView>
        <Image source={require('../assets/logo/taskly_logo.png')} className='w-64 h-20 self-center' />
        
        <View className='px-7 mt-16'>
          <Text className='text-5xl font-semibold'>Login</Text>
          <Text className='text-lg'>Please complete all details require to login.</Text>
        </View>

        <View className='w-screen px-7 mt-6 gap-4'>
          {/* Input field */}
          <View className='gap-4'>
            <View className='w-full bg-slate-50 py-5 px-4 rounded-xl flex-row gap-2 items-center border border-slate-200'>
              <UserIcon color='black' size={20} />
              <TextInput
                placeholder='Username / Email'
                onChangeText={(val) => setEmail(val)}
              />
            </View>

            <View className='w-full bg-slate-50 py-5 px-4 rounded-xl flex-row justify-between items-center border border-slate-200'>
              <View className='flex-row gap-2 items-center'>
                <LockClosedIcon color='black' size={20} />
                <TextInput
                  placeholder='Password'
                  secureTextEntry
                />
              </View>
              <Text className='text-slate-600'>Show</Text>
            </View>
          </View>

          {/* forgot password */}
          <View className='w-full items-end'>
            <Text>Forgot password?</Text>
          </View>
        </View>

        {/* Login Button */}
        <View className='w-screen px-7 mt-7 gap-4'>
          <TouchableOpacity 
            onPress={() => {
              storage.set('user.name', 'Firdaus Fazil');
              //dispatch(setUser({username: 'John Man', email: 'johny@gmail.com', isAuthValid: true}))
              navigation.replace('Main', {screen: 'Dashboard'})
            }}
            className='w-full justify-center items-center bg-[#b0b098] py-4 rounded-full border border-[#b0b098]' 
            style={{
              shadowColor: '#000', // Shadow color
              shadowOffset: { width: 0, height: 3 }, // Drop shadow effect
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 5, // Required for Android shadow
            }}
          >
            <Text className='text-lg text-white font-semibold'>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center w-full mt-8 px-5">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-base font-medium text-gray-600">or continue with</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* Apple Login Button */}
        <View className='w-screen px-7 mt-8 gap-4'>
          <TouchableOpacity 
            className='w-full justify-center items-center bg-black py-4 rounded-full border flex-row gap-2' 
            style={{
              shadowColor: '#000', // Shadow color
              shadowOffset: { width: 0, height: 3 }, // Drop shadow effect
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 5, // Required for Android shadow
            }}
          >
            <Image source={require('../assets/logo/apple.png')} className='h-7 w-7' />
            <Text className='text-lg font-semibold text-white'>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Google Login Button */}
        <View className='w-screen px-7 mt-3 gap-4'>
          <TouchableOpacity 
            className='w-full justify-center items-center bg-white py-4 rounded-full border border-slate-100 flex-row gap-2'  
            style={{
              shadowColor: '#000', // Shadow color
              shadowOffset: { width: 3, height: 3 }, // Drop shadow effect
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 5, // Required for Android shadow
            }}
          >
            <Image source={require('../assets/logo/google.png')} className='h-7 w-7' />
            <Text className='text-lg font-semibold text-black'>Sign in with Google</Text>
          </TouchableOpacity>
        </View>


      </SafeAreaView>

      <View className='absolute bottom-12 left-0 w-screen items-center justify-center flex-row'>
        <Text className='text-md'>Don't have and account ? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text className='text-md font-bold'>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login