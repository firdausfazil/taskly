import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeftIcon, PlusIcon, MinusIcon, TrashIcon } from 'react-native-heroicons/outline'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type SubTask = {
  title: string;
  completed: boolean;
}

type TaskParams = {
  onAddTask: (task: {
    title: string;
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    subtasks: SubTask[];
  }) => void;
  selectedDate?: string;
}

type RootStackParamList = {
  AddTask: TaskParams;
  [key: string]: object | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const AddTask = ({ navigation, route }: any) => {
  const { onAddTask, selectedDate } = route.params;
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [dueDate, setDueDate] = useState(selectedDate ? new Date(selectedDate) : new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [subtasks, setSubtasks] = useState<SubTask[]>([])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const handleSaveTask = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title')
      return
    }

    const newTask = {
      title,
      description,
      dueDate: moment(dueDate).format('YYYY-MM-DD'),
      priority,
      subtasks,
    }

    onAddTask(newTask)
    navigation.goBack()
  }

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a subtask title')
      return
    }

    setSubtasks([...subtasks, { title: newSubtaskTitle, completed: false }])
    setNewSubtaskTitle('')
  }

  const removeSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks]
    updatedSubtasks.splice(index, 1)
    setSubtasks(updatedSubtasks)
  }

  const renderPriorityButton = (value: 'high' | 'medium' | 'low', label: string) => {
    const isSelected = priority === value
    const bgColor = isSelected ? getBgColorForPriority(value) : 'bg-gray-100'
    const textColor = isSelected ? 'text-white' : 'text-gray-700'

    return (
      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-lg items-center justify-center ${bgColor}`}
        onPress={() => setPriority(value)}
      >
        <Text className={`font-medium ${textColor}`}>{label}</Text>
      </TouchableOpacity>
    )
  }

  const getBgColorForPriority = (priorityValue: string): string => {
    switch (priorityValue) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-orange-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
      />
      
      <View className="flex-row items-center justify-between px-4 pb-2 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-2">Add New Task</Text>
        </View>
        
        <TouchableOpacity
          className="py-2 px-4 rounded-lg bg-blue-500"
          onPress={handleSaveTask}
        >
          <Text className="text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 p-5">
        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2 font-medium">Task Title *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base text-gray-800"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2 font-medium">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base text-gray-800"
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2 font-medium">Due Date</Text>
          <TouchableOpacity 
            className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-base text-gray-800">
              {moment(dueDate).format('MMM D, YYYY')}
            </Text>
            <Text className="text-blue-500">Change</Text>
          </TouchableOpacity>
          
          <DatePicker
            modal
            open={showDatePicker}
            date={dueDate}
            mode="date"
            onConfirm={(date) => {
              setShowDatePicker(false)
              setDueDate(date)
            }}
            onCancel={() => {
              setShowDatePicker(false)
            }}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2 font-medium">Priority</Text>
          <View className="flex-row gap-2">
            {renderPriorityButton('high', 'High')}
            {renderPriorityButton('medium', 'Medium')}
            {renderPriorityButton('low', 'Low')}
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-700 text-base font-medium">Subtasks</Text>
            <Text className="text-gray-500 text-sm">{subtasks.length} items</Text>
          </View>
          
          <View className="border border-gray-300 rounded-lg p-4 mb-2">
            {subtasks.length > 0 ? (
              <View className="mb-4">
                {subtasks.map((subtask, index) => (
                  <View key={index} className="flex-row items-center mb-2 py-2 px-3 bg-gray-100 rounded-lg">
                    <Text className="flex-1 text-gray-800">{subtask.title}</Text>
                    <TouchableOpacity onPress={() => removeSubtask(index)}>
                      <TrashIcon color="#ef4444" size={20} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 italic mb-4">No subtasks added yet</Text>
            )}
            
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg p-3 mr-2 text-gray-800"
                placeholder="Add a subtask"
                value={newSubtaskTitle}
                onChangeText={setNewSubtaskTitle}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity 
                className="bg-blue-500 p-3 rounded-lg"
                onPress={addSubtask}
              >
                <PlusIcon color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddTask 