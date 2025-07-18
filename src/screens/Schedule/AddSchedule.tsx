import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Platform, Switch } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeftIcon, ClockIcon, CalendarDaysIcon, BellAlertIcon } from 'react-native-heroicons/outline'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'

interface AddScheduleProps {
  navigation: any;
}

const AddSchedule = ({ navigation }: AddScheduleProps) => {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 30 * 60000)) // Default +30 min
  const [date, setDate] = useState(new Date())
  const [enableReminder, setEnableReminder] = useState(true)
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false)
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [frequency, setFrequency] = useState('daily') // Default to daily

  const formatTime = (date: Date): string => {
    return moment(date).format('h:mm A')
  }

  const formatDate = (date: Date): string => {
    return moment(date).format('ddd, MMM D, YYYY')
  }

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a schedule title')
      return
    }

    // Here you would typically save the schedule
    // For now, just navigate back with success message
    Alert.alert(
      'Success',
      'Schedule added successfully',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-2 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-2">Add Schedule</Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleSave}
          className="py-2 px-4 rounded-lg bg-blue-500"
        >
          <Text className="text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Title</Text>
          <TextInput
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
            placeholder="Enter schedule title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Frequency Selection */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Repeat</Text>
          <View className="flex-row justify-between bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <TouchableOpacity 
              onPress={() => setFrequency('once')}
              className={`flex-1 py-3 px-2 ${frequency === 'once' ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <Text className={`text-center font-medium ${frequency === 'once' ? 'text-white' : 'text-gray-700'}`}>Once</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFrequency('daily')}
              className={`flex-1 py-3 px-2 ${frequency === 'daily' ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <Text className={`text-center font-medium ${frequency === 'daily' ? 'text-white' : 'text-gray-700'}`}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFrequency('weekly')}
              className={`flex-1 py-3 px-2 ${frequency === 'weekly' ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <Text className={`text-center font-medium ${frequency === 'weekly' ? 'text-white' : 'text-gray-700'}`}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFrequency('monthly')}
              className={`flex-1 py-3 px-2 ${frequency === 'monthly' ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <Text className={`text-center font-medium ${frequency === 'monthly' ? 'text-white' : 'text-gray-700'}`}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Selection - Only show if frequency is "once" */}
        {frequency === 'once' && (
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Date</Text>
            <TouchableOpacity
              onPress={() => setOpenDatePicker(true)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center bg-gray-50"
            >
              <Text className="text-gray-800">{formatDate(date)}</Text>
              <CalendarDaysIcon size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        )}

        {/* Time Selection - Side by Side */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Time</Text>
          <View className="flex-row justify-between">
            {/* Start Time */}
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 mb-1 text-xs">Start</Text>
              <TouchableOpacity
                onPress={() => setOpenStartTimePicker(true)}
                className="border border-gray-200 rounded-xl px-3 py-3 flex-row justify-between items-center bg-gray-50"
              >
                <Text className="text-gray-800">{formatTime(startTime)}</Text>
                <ClockIcon size={18} color="#374151" />
              </TouchableOpacity>
            </View>
            
            {/* End Time */}
            <View className="flex-1">
              <Text className="text-gray-600 mb-1 text-xs">End</Text>
              <TouchableOpacity
                onPress={() => setOpenEndTimePicker(true)}
                className="border border-gray-200 rounded-xl px-3 py-3 flex-row justify-between items-center bg-gray-50"
              >
                <Text className="text-gray-800">{formatTime(endTime)}</Text>
                <ClockIcon size={18} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Reminder Toggle */}
        <View className="mb-6 flex-row justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <View className="flex-row items-center">
            <BellAlertIcon size={20} color="#374151" />
            <Text className="text-gray-800 ml-2 font-medium">Enable Reminder</Text>
          </View>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
            thumbColor={enableReminder ? '#3b82f6' : '#9ca3af'}
          />
        </View>
        
        {/* Description */}
        <View className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <Text className="text-base text-gray-700">
            Create a schedule to help you stay organized and manage your time effectively.
            Set specific times and enable reminders to ensure you never miss an important activity.
            {frequency !== 'once' && ' This schedule will repeat ' + frequency + '.'}
          </Text>
        </View>
      </ScrollView>

      {/* Time Picker Modals */}
      <DatePicker
        modal
        open={openStartTimePicker}
        date={startTime}
        mode="time"
        onConfirm={(date) => {
          setOpenStartTimePicker(false)
          setStartTime(date)
          // Automatically set end time 30 minutes later
          setEndTime(new Date(date.getTime() + 30 * 60000))
        }}
        onCancel={() => {
          setOpenStartTimePicker(false)
        }}
        theme="light"
      />

      <DatePicker
        modal
        open={openEndTimePicker}
        date={endTime}
        mode="time"
        onConfirm={(date) => {
          setOpenEndTimePicker(false)
          setEndTime(date)
        }}
        onCancel={() => {
          setOpenEndTimePicker(false)
        }}
        theme="light"
      />

      <DatePicker
        modal
        open={openDatePicker}
        date={date}
        mode="date"
        onConfirm={(date) => {
          setOpenDatePicker(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpenDatePicker(false)
        }}
        theme="light"
      />
    </SafeAreaView>
  )
}

export default AddSchedule