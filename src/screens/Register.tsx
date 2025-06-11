import { View, Text, TouchableOpacity, Image, TextInput, AppState, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeftIcon, LockClosedIcon, LockOpenIcon, UserIcon, EnvelopeIcon, CheckIcon } from "react-native-heroicons/outline";

const Register = ({navigation}: any) => {

    const [checked, setChecked] = useState(false);

    const toggleCheckbox = () => {
        setChecked(!checked);
    };


  return (
    <SafeAreaView className='flex-1 mt-3'>
        <View className='w-screen px-5 flex-row justify-between items-center'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeftIcon color='black' />
            </TouchableOpacity>

            <Image source={require('../assets/logo/taskly_text.png')} className='w-48 h-8' />

            <TouchableOpacity>
                <ChevronLeftIcon color='white' />
            </TouchableOpacity>
        </View>
        

        <View className='px-7 mt-20'>
          <Text className='text-4xl font-semibold'>Create account</Text>
          <Text className='text-lg'>Please complete all details require to create account.</Text>
        </View>

        <View className='w-screen px-7 mt-6 gap-4'>
          {/* Input field */}
            <View className='gap-4'>
                <View className='w-full bg-slate-50 py-5 px-4 rounded-xl flex-row gap-2 items-center border border-slate-200'>
                    <UserIcon color='black' size={20} />
                    <TextInput
                        className='w-80'
                        placeholder='Username'
                    />
                </View>

                <View className='w-full bg-slate-50 py-5 px-4 rounded-xl flex-row gap-2 items-center border border-slate-200'>
                    <EnvelopeIcon color='black' size={20} />
                    <TextInput
                        className='w-80'
                        placeholder='Email'
                    />
                </View>

                <View className='w-full bg-slate-50 py-5 px-4 rounded-xl flex-row justify-between items-center border border-slate-200'>
                    <View className='flex-row gap-2 items-center'>
                        <LockOpenIcon color='black' size={20} />
                        <TextInput
                            className='w-80'
                            placeholder='Password'
                            secureTextEntry
                        />
                    </View>
                </View>

                <View className='w-full bg-slate-50 py-5 px-4 rounded-xl flex-row justify-between items-center border border-slate-200'>
                    <View className='flex-row gap-2 items-center'>
                        <LockClosedIcon color='black' size={20} />
                        <TextInput
                        className='w-80'
                        placeholder='Confirm password'
                        secureTextEntry
                        />
                    </View>
                    <TouchableOpacity>
                        <Text className='text-slate-600'>Show</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className='px-2 flex-row items-center gap-2'>
                <TouchableOpacity onPress={toggleCheckbox} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View 
                        className={`w-7 h-7 rounded-md border border-slate-300 items-center justify-center ${ checked ? 'bg-[#b0b098]' : 'bg-transparent'}`}
                    >
                        {checked && <CheckIcon size={18} color="white" />}
                    </View>  
                </TouchableOpacity>
                <Text>I agree to the Terms and Privacy Policy</Text>
            </View>
        </View>

        {/* Register button */}
        <View className='w-screen px-7 mt-10 gap-4'>
          <TouchableOpacity 
            className='w-full justify-center items-center bg-[#b0b098] py-4 rounded-full border border-[#b0b098]' 
            style={{
              shadowColor: '#000', // Shadow color
              shadowOffset: { width: 0, height: 3 }, // Drop shadow effect
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 5, // Required for Android shadow
            }}
          >
            <Text className='text-lg text-white font-semibold'>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View className='absolute bottom-12 left-0 w-screen items-center justify-center flex-row'>
            <Text className='text-md'>Already have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className='text-md font-bold'>Sign In</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default Register