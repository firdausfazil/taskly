import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import FullLayout from '../../layout/FullLayout'
import { MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline'
import { CheckCircleIcon } from 'react-native-heroicons/solid'
import HeaderMenu from '../../components/Task/HeaderMenu'
import { SwipeListView } from 'react-native-swipe-list-view'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define types
interface SubTask {
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  subtasks?: SubTask[];
}

interface HeaderMenuItem {
  key: string;
  label: string;
  icon: string;
}

type NavigationProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    setOptions: (options: any) => void;
  };
  route: {
    params?: any;
  };
}

export default function Task({ navigation }: NavigationProps) {
  const [showSearch, setShowSearch] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  const swipeListRef = useRef<SwipeListView<Task> | null>(null);
  // Track the currently open row
  const [openRowKey, setOpenRowKey] = useState<string | null>(null);

  // Sample task data - in a real app, you'd fetch from API or storage
  const initialTasks: Task[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the proposal for the new client project',
      dueDate: '2025-05-10',
      priority: 'high',
      completed: true,
      subtasks: [
        { title: 'Research competitor offerings', completed: true },
        { title: 'Outline project scope', completed: true },
        { title: 'Create budget estimate', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Weekly team meeting',
      description: 'Discuss project progress and next steps',
      dueDate: '2025-05-07',
      priority: 'medium',
      completed: false,
      subtasks: [
        { title: 'Prepare agenda', completed: true },
        { title: 'Review last week\'s minutes', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Review code changes',
      description: 'Check and approve recent pull requests',
      dueDate: '2025-05-06',
      priority: 'high',
      completed: false,
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Update the API documentation with recent changes',
      dueDate: '2025-05-09',
      priority: 'low',
      completed: false,
      subtasks: [
        { title: 'Update endpoint descriptions', completed: false },
        { title: 'Add new parameter details', completed: false },
        { title: 'Create usage examples', completed: false }
      ]
    },
  ]

  // Load tasks from storage on mount
  useEffect(() => {
    loadTasks()
  }, [])

  // Filtering tasks when search text changes
  useEffect(() => {
    if (searchText) {
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }, [searchText, tasks])

  const loadTasks = async (): Promise<void> => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks')
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks))
      } else {
        // Use initial tasks if none stored
        setTasks(initialTasks)
        await AsyncStorage.setItem('tasks', JSON.stringify(initialTasks))
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
      // Fallback to initial tasks
      setTasks(initialTasks)
    }
  }

  const saveTasks = async (updatedTasks: Task[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks))
    } catch (error) {
      console.error('Failed to save tasks:', error)
    }
  }

  const handleDropDownTriggerPress = (key: string): void => {
    console.log('Selected key:', key)
    if (key === 'search') {
      setShowSearch(!showSearch)
    } else if (key === 'add') {
      Alert.alert('Navigate to add task');
      navigation.navigate('AddTask', { onAddTask: handleAddTask })
    } else if (key === 'filter') {
      // Implement filtering functionality
      Alert.alert('Filter', 'Filter functionality will be implemented here')
    }
  }

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>): void => {
    const updatedTasks = [...tasks, { ...newTask, id: Date.now().toString(), completed: false }]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const handleCompleteTask = (taskId: string): void => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // Show confirmation with undo option
    Alert.alert(
      'Task Completed', 
      'The task has been marked as complete!',
      [
        {
          text: 'Undo',
          onPress: () => handleUndoComplete(taskId),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            // Close the row after the alert is confirmed
            if (swipeListRef.current && openRowKey) {
              swipeListRef.current.closeAllOpenRows();
            }
          }
        }
      ]
    );
  }

  const handleUndoComplete = (taskId: string): void => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: false } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // Close the row if it's open
    if (swipeListRef.current && openRowKey) {
      swipeListRef.current.closeAllOpenRows();
    }
  }

  const onRowDidOpen = (rowKey : any) => {
    console.log('Iopened row key:', rowKey);
    setOpenRowKey(rowKey);
  }

  const handleDeleteTask = (taskId: string): void => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== taskId)
            setTasks(updatedTasks)
            saveTasks(updatedTasks)
          }
        }
      ]
    )
  }

  const handleToggleSubtask = (taskId: string, subtaskIndex: number): void => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = [...task.subtasks];
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          completed: !updatedSubtasks[subtaskIndex].completed
        };
        
        return {
          ...task,
          subtasks: updatedSubtasks
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity className="flex-row items-center gap-1">
          <Text className="text-xl font-semibold">Current Tasks</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <HeaderMenu 
          items={[
            { key: 'search', title: 'Search', icon: 'search' },
            { key: 'add', title: 'Add Task', icon: 'plus' },
            { key: 'filter', title: 'Filter', icon: 'filter' },
            { key: 'search', title: 'Search', icon: 'search' },
          ]} 
          onSelect={handleDropDownTriggerPress} 
        />
      ),
    })
  }, [navigation, showSearch])

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-200"
      onPress={() => {
        if (item.subtasks && item.subtasks.length > 0) {
          Alert.alert(
            item.title,
            item.description,
            [
              { text: 'Close', style: 'cancel' },
              ...item.subtasks.map((subtask, index) => ({
                text: `${subtask.completed ? '✓' : '○'} ${subtask.title}`,
                onPress: () => handleToggleSubtask(item.id, index)
              }))
            ]
          );
        }
      }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text 
            className={`text-lg font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text 
            className={`text-sm mt-1 ${item.completed ? 'text-gray-300' : 'text-gray-500'}`}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          
          {item.subtasks && item.subtasks.length > 0 && (
            <View className="mt-2 mb-1">
              <Text className={`text-xs font-medium ${item.completed ? 'text-gray-300' : 'text-gray-600'}`}>
                Subtasks: {item.subtasks.filter(st => st.completed).length}/{item.subtasks.length} completed
              </Text>
            </View>
          )}
          
          <View className="flex-row justify-between mt-2">
            <Text className={`text-xs ${item.completed ? 'text-gray-300' : getPriorityColor(item.priority)}`}>
              {item.priority.toUpperCase()}
            </Text>
            <Text className={`text-xs ${item.completed ? 'text-gray-300' : 'text-gray-500'}`}>
              Due: {formatDate(item.dueDate)}
            </Text>
          </View>
        </View>
        {item.completed && (
          <CheckCircleIcon color="#10b981" size={24} />
        )}
      </View>
    </TouchableOpacity>
  )

  const renderHiddenItem = ({ item }: { item: Task }) => (
    <View className="flex-1 flex-row justify-end items-center mb-2 rounded-lg">
      {!item.completed && (
        <TouchableOpacity
          className="bg-green-500 justify-center items-center h-full w-20"
          onPress={() => handleCompleteTask(item.id)}
        >
          {/* <CheckCircleIcon color="white" size={24} /> */}
          <Text className="text-white text-xs mt-1">Complete</Text>
        </TouchableOpacity>
      )}
      {item.completed && (
        <TouchableOpacity
          className="bg-blue-500 justify-center items-center h-full w-20"
          onPress={() => handleUndoComplete(item.id)}
        >
          {/* <Image 
            source={require('../../assets/icons/undo.png')} 
            style={{ width: 24, height: 24, tintColor: 'white' }} 
          /> */}
          <Text className="text-white text-xs mt-1">Undo</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className="bg-red-500 justify-center items-center h-full w-20 rounded-r-lg"
        onPress={() => handleDeleteTask(item.id)}
      >
        {/* <Image 
          source={require('../../assets/icons/trash.png')} 
          style={{ width: 24, height: 24, tintColor: 'white' }} 
        /> */}
        <Text className="text-white text-xs mt-1">Delete</Text>
      </TouchableOpacity>
    </View>
  )

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-orange-500'
      case 'low':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <FullLayout>
      {showSearch && (
        <View className="my-3 w-screen px-5">  
          <View className="w-full py-4 bg-white border border-gray-200 rounded-2xl px-4 flex-row gap-2 items-center">
            <MagnifyingGlassIcon color="#9ca3af" size={20} />
            <TextInput
              placeholder="Search tasks..."
              className="flex-1"
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
              style={{ fontSize: 16, color: '#374151' }}
            />
          </View>
        </View>
      )}

      <View className="flex-1 px-5 pt-2">
        {filteredTasks.length > 0 ? (
          <SwipeListView
            ref={swipeListRef}
            data={filteredTasks}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe
            rightOpenValue={-140}
            previewRowKey={'0'}
            previewOpenDelay={1500}
            keyExtractor={(item: Task) => item.id}
            closeOnRowPress={true}
            onRowDidOpen={onRowDidOpen}
            swipeToOpenPercent={30}
            swipeToClosePercent={50}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-lg mb-4">No tasks found</Text>
            <TouchableOpacity 
              className="bg-blue-500 py-3 px-6 rounded-full flex-row items-center"
              onPress={() => handleDropDownTriggerPress('add')}
            >
              <PlusIcon color="white" size={20} />
              <Text className="text-white font-medium ml-2">Add New Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* {!showSearch && tasks.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-8 right-8 bg-blue-500 w-16 h-16 rounded-full justify-center items-center shadow-lg"
          onPress={() => handleDropDownTriggerPress('add')}
        >
          <PlusIcon color="white" size={28} />
        </TouchableOpacity>
      )} */}
    </FullLayout>
  )
}

const styles = StyleSheet.create({})