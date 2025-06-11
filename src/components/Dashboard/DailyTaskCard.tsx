import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SubTask {
    id: number;
    text: string;
    completed: boolean;
}

const SubTaskList = ({subTask}: {subTask: SubTask}) => {
  const [checked, setChecked] = useState(subTask.completed);

  return (
    <TouchableOpacity
      onPress={() => setChecked(!checked)}
      className="flex-row items-center"
    >
      <View
        className={`w-5 h-5 border-2 rounded-full items-center justify-center ${checked ? 'border-blue-500' : 'border-gray-300'}`}
      >
        {checked && (
          <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </View>
      <Text
        className={`ml-2 text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
      >
        {subTask.text}
      </Text>
    </TouchableOpacity>
  );
}

interface Task {
    id: number,
    title: string;
    description?: string;
    time: string;
    category: string;
    priority: string;
    status: string;
    checklist: SubTask[];
}

export default function DailyTaskCard({ dailyTask }: { dailyTask: Task }) {
  const { width } = Dimensions.get('window');
  const cardWidth = width * 0.85;
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600';
      case 'in progress': return 'text-blue-600';
      case 'pending': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <View style={{ width: cardWidth }} className="h-72 p-2 self-center">
        <View className='flex-1 mx-0 rounded-2xl bg-white p-5 relative border border-gray-100 shadow-sm'>
          <View className='flex-row justify-between items-center mb-3'>
            <Text className="text-xl font-bold text-gray-800">{dailyTask.title}</Text>
            <View className="flex-row items-center bg-blue-100 px-2 py-1 rounded-lg">
              <Ionicons name="time-outline" size={14} color="#4169E1" />
              <Text className="text-xs text-blue-600 ml-1 font-medium">{dailyTask.time}</Text>
            </View>
          </View>

          <View className='gap-2 h-36'>
              <Text numberOfLines={2} ellipsizeMode='tail' className='text-gray-600 text-sm'>
                {dailyTask.description || 'No description available'}
              </Text>
           
              <View className="mt-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Checklist</Text>
                <FlashList
                  data={dailyTask.checklist}
                  renderItem={({ item }) => <SubTaskList subTask={item} />}
                  keyExtractor={({ id }) => id.toString()}
                  estimatedItemSize={30}
                  horizontal={false}
                  ItemSeparatorComponent={() => <View style={{ marginTop:5 }} />}
                  bounces={false}
                />
              </View>
          </View>
          
          <View className="flex-row items-center gap-2 absolute bottom-5 left-5">
            <View className="bg-blue-100 px-3 py-1.5 rounded-lg">
              <Text className="text-blue-600 font-medium text-xs">{dailyTask.category}</Text>
            </View>
            <View className={`${getPriorityColor(dailyTask.priority)} px-3 py-1.5 rounded-lg`}>
              <Text className="text-white font-medium text-xs">{dailyTask.priority}</Text>
            </View>
          </View>
          
          <TouchableOpacity className="absolute bottom-5 right-5 flex-row items-center bg-gray-100 px-3 py-1.5 rounded-lg">
            <Text className={`text-sm font-medium mr-1 ${getStatusColor(dailyTask.status)}`}>{dailyTask.status}</Text>
            <Ionicons name="chevron-forward" size={14} color="#4169E1" />
          </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})