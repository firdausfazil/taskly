import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MMKV } from 'react-native-mmkv'
import { dailySchedule } from '../../data'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'

const DashboardUser2 = () => {
  const insets = useSafeAreaInsets()
  const storage = new MMKV()
  const userName = storage.getString('user.name') || 'User'
  const { width } = Dimensions.get('window')
  
  // Sample data for demonstration
  const taskSummary = {
    completed: 5,
    inProgress: 3,
    pending: 2,
    total: 10
  }
  
  const recentTasks = [
    {
      id: 1,
      title: 'Finish project proposal',
      category: 'Work',
      priority: 'High',
      dueTime: '2:00 PM',
      isCompleted: false
    },
    {
      id: 2,
      title: 'Team meeting',
      category: 'Work',
      priority: 'Medium',
      dueTime: '3:30 PM',
      isCompleted: false
    },
    {
      id: 3,
      title: 'Grocery shopping',
      category: 'Personal',
      priority: 'Low',
      dueTime: '6:00 PM',
      isCompleted: true
    }
  ]

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#3B82F6';
    }
  }

  // Current date
  const today = new Date()
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', options)

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header Section */}
      <View className="px-6 pt-20 pb-6">
        <View className="flex-row justify-between items-center mb-1">
          <View>
            <Text className="text-3xl font-bold text-gray-800">Hello,</Text>
            <Text className="text-3xl font-bold text-blue-600">{userName}</Text>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity className="bg-gray-100 p-2.5 rounded-full">
              <MagnifyingGlassIcon size={22} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-2.5 rounded-full">
              <BellIcon size={22} color="#4B5563" />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></View>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-500 mt-1">{formattedDate}</Text>
      </View>

      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        
        
        {/* Progress Overview */}
        <View className="px-6 mb-6">
          <View className="bg-blue-50 p-5 rounded-2xl">
            <Text className="text-lg font-bold text-gray-800 mb-4">Task Progress</Text>
            
            <View className="mb-4">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-sm text-gray-700">Daily Tasks</Text>
                <Text className="text-sm font-medium text-blue-600">{taskSummary.completed}/{taskSummary.total}</Text>
              </View>
              <View className="h-2.5 w-full bg-gray-200 rounded-full">
                <View 
                  className="h-2.5 bg-blue-600 rounded-full" 
                  style={{ width: `${(taskSummary.completed / taskSummary.total) * 100}%` }} 
                />
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">{taskSummary.completed}</Text>
                <Text className="text-xs text-gray-500">Completed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-amber-500">{taskSummary.inProgress}</Text>
                <Text className="text-xs text-gray-500">In Progress</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-500">{taskSummary.pending}</Text>
                <Text className="text-xs text-gray-500">Pending</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">{taskSummary.total}</Text>
                <Text className="text-xs text-gray-500">Total</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Categories */}
        
        
        {/* Today's Tasks */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Today's Tasks</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="space-y-4">
            {recentTasks.map(task => (
              <View 
                key={task.id}
                className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm ${task.isCompleted ? 'opacity-70' : ''}`}
                style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}
              >
                <View className="flex-row items-center mb-2">
                  <TouchableOpacity className="mr-3">
                    <View className={`w-6 h-6 border-2 rounded-full items-center justify-center ${task.isCompleted ? 'border-blue-500' : 'border-gray-300'}`}>
                      {task.isCompleted && (
                        <View className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text 
                    numberOfLines={1}
                    className={`text-base font-semibold flex-1 ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                  >
                    {task.title}
                  </Text>
                  <View 
                    style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}
                    className="px-2 py-1 rounded-md"
                  >
                    <Text style={{ color: getPriorityColor(task.priority) }} className="text-xs font-medium">
                      {task.priority}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center pl-9">
                  <View className="bg-blue-50 px-2 py-1 rounded-md mr-2">
                    <Text className="text-blue-600 text-xs">{task.category}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                    <Text className="text-gray-500 text-xs ml-1">{task.dueTime}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* Today's Schedule */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Today's Schedule</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-gray-50 rounded-2xl p-4">
            {dailySchedule.slice(0, 3).map((schedule, index) => (
              <View key={schedule.id} className={`${index !== 0 ? 'border-t border-gray-100 pt-3 mt-3' : ''}`}>
                <View className="flex-row items-center">
                  <View className={`p-2 rounded-full ${schedule.isCompleted ? 'bg-blue-100' : 'bg-amber-100'}`}>
                    <Ionicons 
                      name={schedule.isCompleted ? "checkmark-circle" : "time-outline"} 
                      size={20} 
                      color={schedule.isCompleted ? "#4169E1" : "#F59E0B"} 
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text 
                      numberOfLines={1} 
                      ellipsizeMode="tail" 
                      className={`text-base font-semibold ${schedule.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                    >
                      {schedule.title}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                      {schedule.start_time}{schedule.end_time ? ` - ${schedule.end_time}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity className="p-1">
                    <View className={`w-6 h-6 border-2 rounded-full items-center justify-center ${schedule.isCompleted ? 'border-blue-500' : 'border-gray-300'}`}>
                      {schedule.isCompleted ? (
                        <View className="w-3 h-3 bg-blue-500 rounded-full" />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      

    </View>
  )
}

export default DashboardUser2 