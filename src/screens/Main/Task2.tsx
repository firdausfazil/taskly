import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, StatusBar, Modal, Pressable } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import FullLayout from '../../layout/FullLayout'
import { MagnifyingGlassIcon, PlusIcon, CalendarDaysIcon, CheckIcon, TrashIcon, XMarkIcon, PencilSquareIcon } from 'react-native-heroicons/outline'
import { CheckCircleIcon } from 'react-native-heroicons/solid'
import HeaderMenu from '../../components/Task/HeaderMenu'
import { SwipeListView } from 'react-native-swipe-list-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'

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

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
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

// Memoized SubTask Component
const SubtaskItem = React.memo(({ 
  subtask, 
  onToggle 
}: { 
  subtask: SubTask; 
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center mb-1"
      onPress={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <View className={`h-5 w-5 rounded-md ${subtask.completed ? 'bg-blue-500' : 'border-2 border-gray-400'} justify-center items-center`}>
        {subtask.completed && <CheckIcon color="white" size={16} />}
      </View>
      <Text className={`ml-3 text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
        {subtask.title}
      </Text>
    </TouchableOpacity>
  );
});

// Memoized Subtasks Container
const SubtasksList = React.memo(({ 
  subtasks, 
  onToggle 
}: { 
  subtasks: SubTask[]; 
  onToggle: (index: number) => void;
}) => {
  return (
    <View className="space-y-3 bg-gray-50 p-4 rounded-xl">
      {subtasks.map((subtask, index) => (
        <SubtaskItem
          key={index}
          subtask={subtask}
          onToggle={() => onToggle(index)}
        />
      ))}
    </View>
  );
});

const Task2 = ({ navigation }: NavigationProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'))
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})
  
  const swipeListRef = useRef<SwipeListView<Task> | null>(null);
  const [openRowKey, setOpenRowKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sample task data
  const initialTasks: Task[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the proposal for the new client project',
      dueDate: moment().format('YYYY-MM-DD'),
      priority: 'high',
      completed: false,
      subtasks: [
        { title: 'Research competitor offerings', completed: true },
        { title: 'Outline project scope', completed: false },
        { title: 'Create budget estimate', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Weekly team meeting',
      description: 'Discuss project progress and next steps',
      dueDate: moment().add(1, 'days').format('YYYY-MM-DD'),
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
      dueDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      priority: 'high',
      completed: true,
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Update the API documentation with recent changes',
      dueDate: moment().format('YYYY-MM-DD'),
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

  // Update filtered tasks when search text or selected date changes
  useEffect(() => {
    filterTasks()
  }, [searchText, tasks, selectedDate])

  // Update marked dates whenever tasks change
  useEffect(() => {
    updateMarkedDates()
  }, [tasks])

  const loadTasks = async (): Promise<void> => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks2')
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks))
      } else {
        // Use initial tasks if none stored
        setTasks(initialTasks)
        await AsyncStorage.setItem('tasks2', JSON.stringify(initialTasks))
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
      // Fallback to initial tasks
      setTasks(initialTasks)
    }
  }

  const saveTasks = async (updatedTasks: Task[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('tasks2', JSON.stringify(updatedTasks))
    } catch (error) {
      console.error('Failed to save tasks:', error)
    }
  }

  const filterTasks = (): void => {
    let filtered = tasks;
    
    // Filter by date
    filtered = filtered.filter(task => task.dueDate === selectedDate);
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredTasks(filtered);
  }

  const updateMarkedDates = (): void => {
    const dates: MarkedDates = {};
    
    // Mark dates with tasks
    tasks.forEach(task => {
      if (!dates[task.dueDate]) {
        dates[task.dueDate] = {
          marked: true,
          dotColor: task.completed ? '#10b981' : '#ef4444'
        };
      }
    });
    
    // Mark selected date
    dates[selectedDate] = {
      ...dates[selectedDate],
      selected: true,
      selectedColor: '#3b82f6'
    };
    
    setMarkedDates(dates);
  }

  const handleDropDownTriggerPress = (key: string): void => {
    if (key === 'calendar') {
      setShowCalendar(!showCalendar)
    } else if (key === 'add') {
      navigation.navigate('AddTask', { 
        onAddTask: handleAddTask,
        selectedDate: selectedDate
      })
    } else if (key === 'filter') {
      // Implement filtering functionality
      Alert.alert('Filter', 'Filter functionality will be implemented here')
    }
  }

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>): void => {
    const updatedTasks = [...tasks, { 
      ...newTask, 
      id: Date.now().toString(), 
      completed: false,
      dueDate: newTask.dueDate || selectedDate
    }]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const handleToggleComplete = (taskId: string): void => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
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
    
    // Update the selectedTask if it's the one being modified
    if (selectedTask && selectedTask.id === taskId && selectedTask.subtasks) {
      const updatedSubtasks = [...selectedTask.subtasks];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        completed: !updatedSubtasks[subtaskIndex].completed
      };
      
      setSelectedTask({
        ...selectedTask,
        subtasks: updatedSubtasks
      });
    }
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
            // Close any open rows
            if (swipeListRef.current && openRowKey) {
              swipeListRef.current.closeAllOpenRows();
            }
            
            const updatedTasks = tasks.filter(task => task.id !== taskId)
            setTasks(updatedTasks)
            saveTasks(updatedTasks)
            if (selectedTask && selectedTask.id === taskId) {
              setModalVisible(false)
              setSelectedTask(null)
            }
          }
        }
      ]
    )
  }

  const handleUpdateTask = (taskId: string, updatedFields: Partial<Task>): void => {
    // Close any open rows
    if (swipeListRef.current && openRowKey) {
      swipeListRef.current.closeAllOpenRows();
    }
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedFields } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // Update selectedTask to reflect changes
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updatedFields });
    }
    
    // Exit edit mode
    setModalVisible(false);
  }

  const onRowDidOpen = (rowKey: string): void => {
    setOpenRowKey(rowKey);
  }

  const handleDateSelect = (date: any): void => {
    const formattedDate = date.dateString;
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity 
          className="flex-row items-center gap-1"
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text className="text-xl font-semibold">Tasks</Text>
          <CalendarDaysIcon color="#3b82f6" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <HeaderMenu 
          items={[
            { key: 'calendar', title: 'Calendar', icon: 'calendar' },
            { key: 'add', title: 'Add Task', icon: 'plus' },
            { key: 'filter', title: 'Filter', icon: 'filter' },
          ]} 
          onSelect={handleDropDownTriggerPress} 
        />
      ),
    })
  }, [navigation, showCalendar])

  const renderItem = ({ item }: { item: Task }) => (
    <Pressable 
      className="bg-white px-4 py-4 rounded-xl shadow-sm border border-gray-100"
      onPress={() => {
        setSelectedTask(item);
        setModalVisible(true);
      }}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        marginHorizontal: 1, // Add slight margin to avoid button overlap
        marginBottom: 12, // Match the marginBottom of hidden item
      }}
    >
      <View className="flex-row items-start">
        <TouchableOpacity
          className="mr-3 mt-1"
          onPress={() => handleToggleComplete(item.id)}
        >
          {item.completed ? (
            <CheckCircleIcon color="#10b981" size={24} />
          ) : (
            <View className="h-6 w-6 rounded-full border-2 border-gray-300" />
          )}
        </TouchableOpacity>
        
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text 
              className={`text-base font-semibold ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
              numberOfLines={1}
              style={{ maxWidth: '85%' }}
            >
              {item.title}
            </Text>
            
            <View 
              className={`px-2 py-1 rounded-full ${
                item.priority === 'high' 
                  ? 'bg-red-100' 
                  : item.priority === 'medium' 
                    ? 'bg-orange-100' 
                    : 'bg-blue-100'
              }`}
            >
              <Text className={`text-xs font-medium ${
                item.priority === 'high' 
                  ? 'text-red-700' 
                  : item.priority === 'medium' 
                    ? 'text-orange-700' 
                    : 'text-blue-700'
              }`}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Text>
            </View>
          </View>
          
          {item.description ? (
            <Text 
              className={`text-sm mt-1 ${item.completed ? 'text-gray-300' : 'text-gray-500'}`}
              numberOfLines={1}
            >
              {item.description}
            </Text>
          ) : null}
          
          <View className="flex-row justify-between items-center mt-3">
            {item.subtasks && item.subtasks.length > 0 && (
              <View className="flex-row items-center">
                <View className="w-20 h-1.5 rounded-full bg-gray-200">
                  <View 
                    className="h-1.5 rounded-full bg-blue-500" 
                    style={{ 
                      width: `${(item.subtasks.filter(st => st.completed).length / item.subtasks.length) * 100}%` 
                    }} 
                  />
                </View>
                <Text className={`ml-2 text-xs font-medium ${item.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                  {item.subtasks.filter(st => st.completed).length}/{item.subtasks.length}
                </Text>
              </View>
            )}
            
            <View className="flex-row items-center">
              <CalendarDaysIcon color={item.completed ? "#d1d5db" : "#6b7280"} size={14} />
              <Text className={`ml-1 text-xs ${item.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                {formatDate(item.dueDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )

  // Task Details Modal - using useMemo for optimized rendering
  const TaskModal = () => {
    if (!selectedTask) return null;
    
    // Use ref to keep stable rendering
    const taskRef = useRef<Task>(selectedTask);
    
    // Update ref when selectedTask changes
    useEffect(() => {
      if (selectedTask) {
        taskRef.current = selectedTask;
      }
    }, [selectedTask]);

    const resetAndCloseModal = useCallback(() => {
      setModalVisible(false);
      setSelectedTask(null);
    }, []);

    const handleEditTask = useCallback(() => {
      if (taskRef.current.completed) {
        Alert.alert(
          "Cannot Edit Task",
          "Completed tasks cannot be edited. Please mark the task as incomplete first."
        );
        return;
      }
      
      navigation.navigate('EditTask', {
        task: taskRef.current,
        onUpdateTask: handleUpdateTask
      });
      
      // Close the modal after navigation
      setModalVisible(false);
      setSelectedTask(null);
    }, [navigation]);
    
    // Special version for modal to ensure it doesn't flicker
    const handleModalSubtaskToggle = useCallback((subtaskIndex: number) => {
      // Only update the selectedTask
      if (taskRef.current && taskRef.current.subtasks) {
        const updatedSubtasks = [...taskRef.current.subtasks];
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          completed: !updatedSubtasks[subtaskIndex].completed
        };
        
        // Update the tasks array and save (for persistence)
        const updatedTasks = tasks.map(task => 
          task.id === taskRef.current.id 
            ? { 
                ...task, 
                subtasks: updatedSubtasks 
              } 
            : task
        );
        
        // Update both the task list and the selected task
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        
        // Directly update the ref to avoid re-render
        taskRef.current = {
          ...taskRef.current,
          subtasks: updatedSubtasks
        };
        
        // Use forceUpdate to only update the specific subtask
        setSelectedTask({
          ...taskRef.current
        });
      }
    }, [tasks]);
    
    // Memoize task details to prevent re-renders
    const taskDetails = useMemo(() => {
      return (
        <>
          {/* Header with pill indicator */}
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-6" />
            <View className="flex-row items-center justify-between w-full">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-800">{taskRef.current.title}</Text>
                <View className="flex-row items-center mt-1">
                  <View className={`h-2.5 w-2.5 rounded-full ${getPriorityColor(taskRef.current.priority).replace('text-', 'bg-')}`} />
                  <Text className="ml-2 text-xs text-gray-500">
                    {taskRef.current.priority.charAt(0).toUpperCase() + taskRef.current.priority.slice(1)} Priority
                  </Text>
                  <View className="mx-2 w-1 h-1 bg-gray-300 rounded-full" />
                  <Text className="text-xs text-gray-500">
                    {formatDate(taskRef.current.dueDate)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  resetAndCloseModal();
                }}
                className="p-2 rounded-full"
              >
                <XMarkIcon color="#6b7280" size={24} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Status Indicator */}
          <View className="mb-5">
            <View className={`self-start px-3 py-1 rounded-full ${taskRef.current.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Text className={`text-xs font-medium ${taskRef.current.completed ? 'text-green-700' : 'text-blue-700'}`}>
                {taskRef.current.completed ? 'Completed' : 'In Progress'}
              </Text>
            </View>
          </View>
          
          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
            <Text className="text-gray-600">
              {taskRef.current.description || 'No description'}
            </Text>
          </View>
        </>
      );
    }, [taskRef.current.id]);

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetAndCloseModal}
      >
        <Pressable 
          className="flex-1 justify-end bg-black/60" 
          onPress={resetAndCloseModal}
        >
          <Pressable 
            className="bg-white rounded-t-3xl p-6 pt-8 shadow-xl" 
            onPress={e => e.stopPropagation()}
          >
            {taskDetails}
            
            {/* Subtasks */}
            {taskRef.current.subtasks && taskRef.current.subtasks.length > 0 && (
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-3">Subtasks</Text>
                <SubtasksList 
                  subtasks={taskRef.current.subtasks} 
                  onToggle={handleModalSubtaskToggle} 
                />
              </View>
            )}
            
            {/* Action icons */}
            <View className="flex-row justify-between items-center pt-4 border-t border-gray-100">
              {/* Delete action */}
              <TouchableOpacity 
                className="flex-row items-center p-3"
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(taskRef.current.id);
                }}
              >
                <View className="bg-red-100 p-2 rounded-full">
                  <TrashIcon color="#ef4444" size={20} />
                </View>
                <Text className="ml-2 text-sm font-medium text-red-500">Delete</Text>
              </TouchableOpacity>
              
              {/* Edit action */}
              <TouchableOpacity 
                className="flex-row items-center p-3"
                onPress={(e) => {
                  e.stopPropagation();
                  handleEditTask();
                }}
                disabled={taskRef.current.completed}
              >
                <View className={`p-2 rounded-full ${taskRef.current.completed ? 'bg-gray-100' : 'bg-blue-100'}`}>
                  <PencilSquareIcon color={taskRef.current.completed ? "#9ca3af" : "#3b82f6"} size={20} />
                </View>
                <Text className={`ml-2 text-sm font-medium ${taskRef.current.completed ? 'text-gray-400' : 'text-blue-500'}`}>
                  {taskRef.current.completed ? 'Cannot Edit' : 'Edit Task'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

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
    return moment(dateString).format('MMM D, YYYY')
  }

  return (
    <FullLayout>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="#f5f5f5"
        />
        
        {/* Custom Header */}
        <View className="w-full px-5 pt-5 pb-2 ios:pt-20 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-gray-800">Tasks</Text>
          </View>
          <TouchableOpacity 
            className="bg-blue-500 py-2 px-4 rounded-full flex-row items-center"
            onPress={() => handleDropDownTriggerPress('add')}
          >
            <PlusIcon color="white" size={18} />
            <Text className="text-white font-medium ml-1">New</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View className="my-2 w-screen px-5 ios:mt-2">  
          <View className="w-full py-1 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center shadow-sm">
            <MagnifyingGlassIcon color="#9ca3af" size={20} />
            <TextInput
              placeholder="Search tasks..."
              className="flex-1 mx-2"
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
              style={{ fontSize: 16, color: '#374151' }}
            />
            <TouchableOpacity 
              onPress={() => setShowCalendar(!showCalendar)}
              className="p-1"
            >
              <CalendarDaysIcon color="#3b82f6" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar View (Toggleable) */}
        {showCalendar && (
          <View className="px-5 mb-3">
            <Calendar
              markedDates={markedDates}
              onDayPress={handleDateSelect}
              theme={{
                todayTextColor: '#3b82f6',
                arrowColor: '#3b82f6',
              }}
            />
          </View>
        )}

        {/* Selected Date Display */}
        <View className="px-5 mb-3 flex-row justify-between items-center">
          <Text className="text-lg font-medium text-gray-800">
            {formatDate(selectedDate)}
          </Text>
        </View>

        {/* Task List */}
        <View className="flex-1 px-5 pt-2">
          {filteredTasks.length > 0 ? (
            <SwipeListView
              ref={swipeListRef}
              data={filteredTasks}
              renderItem={renderItem}
              keyExtractor={(item: Task) => item.id}
              closeOnRowPress={true}
              onRowDidOpen={onRowDidOpen}
              renderHiddenItem={({ item }) => (
                <View 
                  style={{ 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: '100%',
                    marginBottom: 12,
                    marginHorizontal: 1,
                    borderRadius: 12,
                    overflow: 'hidden'
                  }}
                >
                  {/* Left action (Edit) */}
                  <TouchableOpacity
                    style={{ 
                      backgroundColor: !item.completed ? '#3b82f6' : '#9ca3af', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 96,
                      height: 96,
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12
                    }}
                    onPress={() => {
                      if (!item.completed) {
                        // Close row first
                        if (swipeListRef.current) {
                          swipeListRef.current.closeAllOpenRows();
                        }
                        // Navigate to edit screen
                        navigation.navigate('EditTask', {
                          task: item,
                          onUpdateTask: handleUpdateTask
                        });
                      } else {
                        Alert.alert(
                          "Cannot Edit Task",
                          "Completed tasks cannot be edited. Please mark the task as incomplete first."
                        );
                      }
                    }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <PencilSquareIcon color="white" size={22} />
                      <Text style={{ color: 'white', fontWeight: '500', marginTop: 4, fontSize: 12 }}>Edit</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Right action (Delete) */}
                  <TouchableOpacity
                    style={{ 
                      backgroundColor: '#ef4444',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 96,
                      height: 96,
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12
                    }}
                    onPress={() => handleDeleteTask(item.id)}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <TrashIcon color="white" size={22} />
                      <Text style={{ color: 'white', fontWeight: '500', marginTop: 4, fontSize: 12 }}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              leftOpenValue={90}
              rightOpenValue={-90}
              previewRowKey={filteredTasks[0]?.id}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              friction={10}
              tension={40}
              swipeToOpenPercent={20}
              swipeToOpenVelocityContribution={10}
              onRowClose={() => setOpenRowKey(null)}
              useNativeDriver={true}
              stopRightSwipe={-90}
              stopLeftSwipe={90}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400 text-lg mb-4">No tasks for this date</Text>
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

        {/* Task Modal */}
        <TaskModal />
    </FullLayout>
  )
}

export default Task2