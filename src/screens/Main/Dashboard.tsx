import { View, Text, Dimensions, ScrollView, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from "@shopify/flash-list";
import DailyTaskCard from '../../components/Dashboard/DailyTaskCard'
import Header from '../../components/Dashboard/Header'
import {
  LineChart,
} from "react-native-chart-kit";
import { chartConfig } from '../../config/ChartConfig';
import DailySchedule from '../../components/Dashboard/DailySchedule';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { dailyTasks, dailyScheduleData, performanceData } from '../../data/dashboardData';
const {width, height} = Dimensions.get('window');

const Dashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f8fafc"
      />
      <Header />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      > 
        {/* Stats Cards */}
        <View className="flex-row mx-4 justify-between mt-6">
          <View className="bg-white rounded-2xl p-4 shadow-md w-[32%] border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="bg-blue-100 p-2 rounded-full">
                <Ionicons name="checkmark-done" size={18} color="#4169E1" />
              </View>
            </View>
            <Text className="text-gray-500 text-sm mt-2">Completed</Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-2xl font-bold">7</Text>
              <Text className="text-green-500 ml-2 text-xs font-medium">+2 today</Text>
            </View>
          </View>
          
          <View className="bg-white rounded-2xl p-4 shadow-md w-[32%] border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="bg-amber-100 p-2 rounded-full">
                <Ionicons name="time-outline" size={18} color="#F59E0B" />
              </View>
            </View>
            <Text className="text-gray-500 text-sm mt-2">Upcoming</Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-2xl font-bold">5</Text>
              <Text className="text-amber-500 ml-2 text-xs font-medium">2 urgent</Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-md w-[32%] border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="bg-red-100 p-2 rounded-full">
                <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
              </View>
            </View>
            <Text className="text-gray-500 text-sm mt-2">Overdue</Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-2xl font-bold">1</Text>
              <Text className="text-red-500 ml-2 text-xs font-medium">1 important</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View className='mx-4 mt-8 bg-white p-4 rounded-2xl shadow-md border border-gray-100'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='font-semibold text-lg'>Performance</Text>
            <TouchableOpacity>
              <Text className='text-blue-600 text-sm'>This Month</Text>
            </TouchableOpacity>
          </View>

          <View className='w-full items-center justify-center'>
            <LineChart
              data={performanceData}
              width={width*0.85}
              height={200}
              chartConfig={{
                ...chartConfig,
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#4169E1"
                }
              }}
              bezier
              style={{borderRadius: 16, marginTop: 8}}
            />
          </View>
        </View>

        {/* Daily Schedule */}
        <View className='mx-4 mt-8'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='font-semibold text-lg'>Daily Schedule</Text>
            <TouchableOpacity>
              <Text className='text-blue-600 text-sm'>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className='bg-white rounded-2xl shadow-md border border-gray-100 p-4'>
            <FlashList
              data={dailyScheduleData.slice(0, 2)}
              renderItem={({ item }) => <DailySchedule dailySchedule={item} />}
              keyExtractor={({ id }) => id.toString()}
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <View className="h-3" />}
            />
          </View>
        </View>

        {/* Today's Task */}
        <View className='mx-4 mt-8 mb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='font-semibold text-lg'>Today's Tasks</Text>
            <TouchableOpacity>
              <Text className='text-blue-600 text-sm'>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="mb-4 flex items-center justify-center">
            <FlashList
              data={dailyTasks}
              renderItem={({ item }) => <DailyTaskCard dailyTask={item} />}
              keyExtractor={({ id }) => id.toString()}
              //estimatedItemSize={100}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onViewableItemsChanged={onViewableItemsChanged}
              contentContainerStyle={{ paddingHorizontal: width * 0.075 }}
            />

            {/* Indicator Dots */}
            <View className="flex-row justify-center mt-4">
              {dailyTasks.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 mx-1 rounded-full ${currentIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2'}`}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard