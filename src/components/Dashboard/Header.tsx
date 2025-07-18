import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { MMKV } from 'react-native-mmkv'

const Header = () => {
  const storage = new MMKV()
  const userName = storage.getString('user.name') || 'User'

  return (
    <View className='w-full px-5 py-3 flex-row justify-between items-center'>
      <View className='flex-row items-center gap-3'>
        <View className='bg-blue-100 p-2.5 rounded-full shadow-sm'>
          <Ionicons name="person" size={24} color="#4169E1" />
        </View>
        <View>
          <Text className='font-semibold text-lg text-gray-800'>Hi, {userName}</Text>
          <Text className='text-gray-500 text-sm'>Let's be productive today!</Text>
        </View>
      </View>

      <TouchableOpacity className='bg-white p-2.5 rounded-full shadow-sm border border-gray-100'>
        <Ionicons name="notifications-outline" size={22} color="#4169E1" />
        <View className='absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full'></View>
      </TouchableOpacity>
    </View>
  )
}

export default Header