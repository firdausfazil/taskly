import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function MainLayout({children}: {children : React.ReactNode}): React.JSX.Element {
  return (
    <View className='flex-1 relative bg-white'>
        {children}

        <View className='absolute bottom-0 left-0 h-20 w-screen bg-red-400'>
            <View className='absolute bottom-14 left-1/2 translate-y-1/4 -translate-x-1/2 bg-white h-24 w-24 rounded-full justify-center items-center'>
                <Text>huu</Text>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})