import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
//import { RootState  } from '../redux/store/store'
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../constant/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';

const Start = ({navigation}: any) => {

    //const user = useSelector((state: RootState) => state.auth)

  return (
    
    <ImageBackground 
        source={require('../assets/images/started-bg.webp')} 
        className="w-full h-full flex-1"
    >
        <LinearGradient 
            colors={['#b0b0981a', '#f7f5f380']}
            style={{ flex: 1 }}
        >
          <SafeAreaView>
            {/* <Text style={{ color: 'white', fontSize: 20 }}>Hello Gradient!</Text> */}
            <View className='items-center mt-3'>
              <View className='flex-row gap-2 items-end'>
              <CustomText content='Organized' className='text-4xl text-[#6d8155]  font-semibold' />
              <CustomText content='and' className='text-xl text-white' />
              <CustomText content='Productive' className='text-4xl text-[#6d8155] font-semibold' />
              </View>
            </View>
              {/* <View className='px-5 mt-20'>
                <View className='flex-row items-start gap-2'>
                  <CustomText content='Stay' className='text-3xl text-white' />
                  <CustomText content='Organized,' className='text-6xl text-white font-semibold' />
                </View>
                <View className='flex-row items-start gap-2 pl-3'>
                  <CustomText content='stay' className='text-2xl text-white' />
                  <CustomText content='Productive!' className='text-7xl text-white font-semibold' />
                </View>
              </View> */}


          </SafeAreaView>

            <View className='absolute bottom-0 my-20 flex w-full gap-5'>

              <View className='px-8'>
                <CustomText content='Manage your tasks efficiently and stay on top of your daily priorities with ease.' className='text-black text-2xl font-medium' />
              </View>

              <TouchableOpacity onPress={() => navigation.replace('Onboarding')} className='bg-[#b0b098] dark:bg-[#FEF4EA] py-4 items-center justify-center mx-10 rounded-full'>
                <Text className='text-xl font-bold text-white dark:text-white'>Get Started</Text>
              </TouchableOpacity>
            </View>
            
        </LinearGradient>
    </ImageBackground>

  )
}

export default Start