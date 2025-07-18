import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

interface schedule {
    id: number,
    title: string,
    start_time: string,
    end_time: string,
    isCompleted: boolean
}

export default function DailySchedule({dailySchedule}: {dailySchedule: schedule}) {
    const [checked, setChecked] = useState(dailySchedule.isCompleted);

    return (
        <View className='flex-row items-center gap-3 py-3 px-3 rounded-xl justify-between'>
            <View className='flex-row gap-3 items-center flex-1'>
                <View className={`p-2 rounded-full ${checked ? 'bg-blue-100' : 'bg-amber-100'}`}>
                    <Ionicons 
                        name={checked ? "checkmark-circle" : "time-outline"} 
                        size={20} 
                        color={checked ? "#4169E1" : "#F59E0B"} 
                    />
                </View>
                <View className='flex-1'>
                    <Text 
                        numberOfLines={1} 
                        ellipsizeMode='tail' 
                        className={`text-base font-semibold ${checked ? 'text-gray-500' : 'text-gray-800'} ${checked ? 'line-through' : ''}`}
                    >
                        {dailySchedule.title}
                    </Text>
                    <Text className='text-xs text-gray-500 mt-0.5'>
                        {dailySchedule.start_time}{dailySchedule.end_time ? ` - ${dailySchedule.end_time}` : ''}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => setChecked(!checked)}
                className="p-1"
            >
                <View className={`w-6 h-6 border-2 rounded-full items-center justify-center ${checked ? 'border-blue-500' : 'border-gray-300'}`}>
                    {checked ? (
                        <View className="w-3 h-3 bg-blue-500 rounded-full" />
                    ) : null}
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})