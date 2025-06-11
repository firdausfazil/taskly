import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { CheckIcon, ClockIcon } from 'react-native-heroicons/outline';

interface schedule {
    id: number,
    title: string,
    start_time: string,
    end_time: string,
    isCompleted: boolean
}

export default function ScheduleCard({dailySchedule}: {dailySchedule: schedule}) {
    const [checked, setChecked] = useState(dailySchedule.isCompleted);

    const toggleComplete = () => {
        // In a real app, you would update the backend here
        setChecked(!checked);
    };

    // Format time display
    const timeDisplay = dailySchedule.end_time 
        ? `${dailySchedule.start_time} - ${dailySchedule.end_time}`
        : dailySchedule.start_time;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => {
                Alert.alert(
                    "Schedule Options",
                    "What would you like to do?",
                    [
                        {
                            text: "Edit",
                            onPress: () => console.log("Edit pressed")
                        },
                        {
                            text: "Delete",
                            onPress: () => console.log("Delete pressed"),
                            style: "destructive"
                        },
                        {
                            text: "Cancel",
                            style: "cancel"
                        }
                    ]
                );
            }}
            className={`mx-4 my-1 p-4 rounded-xl ${
                checked ? 'bg-blue-50' : 'bg-white'
            } border border-gray-100 shadow-sm`}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 pr-2">
                    <View className={`p-2 rounded-full ${checked ? 'bg-blue-100' : 'bg-amber-100'} mr-3`}>
                        {checked ? (
                            <CheckIcon size={18} color="#3b82f6" />
                        ) : (
                            <ClockIcon size={18} color="#f59e0b" />
                        )}
                    </View>
                    
                    <View className="flex-1">
                        <Text 
                            numberOfLines={1} 
                            ellipsizeMode="tail" 
                            className={`text-base font-semibold ${
                                checked ? 'text-gray-500' : 'text-gray-800'
                            } ${checked ? 'line-through' : ''}`}
                        >
                            {dailySchedule.title}
                        </Text>
                        
                        <View className="flex-row items-center mt-1">
                            <Text className="text-xs text-gray-500">
                                {timeDisplay}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity
                    onPress={toggleComplete}
                    className="p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View className={`w-6 h-6 border-2 rounded-full items-center justify-center ${
                        checked ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                        {checked && (
                            <View className="w-3 h-3 bg-blue-500 rounded-full" />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})