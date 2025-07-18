import { View, Text } from 'react-native'
import React, { Children } from 'react'

const FullLayout = ({children}: {children: React.ReactNode}): React.JSX.Element => {
  return (
    <View className='bg-white flex-1'>
      {children}
    </View>
  )
}

export default FullLayout