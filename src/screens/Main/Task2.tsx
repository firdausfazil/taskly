import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, StatusBar, Modal, Pressable, Dimensions, ViewStyle, TextStyle, Image, FlatList } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import FullLayout from '../../layout/FullLayout'
import { MagnifyingGlassIcon, PlusIcon, CalendarDaysIcon, CheckIcon, TrashIcon, XMarkIcon, PencilSquareIcon, ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/outline'
import { CheckCircleIcon } from 'react-native-heroicons/solid'
import HeaderMenu from '../../components/Task/HeaderMenu'
import { SwipeListView } from 'react-native-swipe-list-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Calendar as BigCalendar, EventCellStyle, CalendarEvent } from 'react-native-big-calendar'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'

// Define types
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  id: string;
  color: string;
}

interface SubTask {
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
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

// Add type for custom event rendering
interface CustomEvent extends CalendarEvent {
  color: string;
}

// Event styles
const eventStyles = StyleSheet.create({
  eventContainer: {
    padding: 4,
    borderRadius: 6,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  eventText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  } as TextStyle,
});

// Calendar event style type
type EventCellStyleProps = {
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  marginVertical: number;
  opacity: number;
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

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
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})
  const [isCalendarView, setIsCalendarView] = useState<boolean>(false)
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<moment.Moment>(moment())
  const [startDate, setStartDate] = useState<string | null>(moment().format('YYYY-MM-DD'))
  const [isSelectingStartDate, setIsSelectingStartDate] = useState<boolean>(true)
  
  const swipeListRef = useRef<SwipeListView<Task> | null>(null);
  const [openRowKey, setOpenRowKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Navigation functions for calendar
  const handlePreviousMonth = () => {
    setCurrentCalendarDate(prevDate => moment(prevDate).subtract(1, 'month').toDate());
    setCurrentMonth(prevMonth => prevMonth.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prevDate => moment(prevDate).add(1, 'month').toDate());
    setCurrentMonth(prevMonth => prevMonth.clone().add(1, 'month'));
  };

  // Sample task data
  const initialTasks: Task[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the proposal for the new client project',
      startDate: '2025-06-08',
      dueDate: '2025-06-14',
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
      startDate: '2025-06-27',
      dueDate: '2025-06-28',
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
      startDate: '2025-06-26',
      dueDate: '2025-06-27',
      priority: 'high',
      completed: true,
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Update the API documentation with recent changes',
      startDate: '2025-06-27',
      dueDate: '2025-07-05',
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
  }, [searchText, tasks, selectedDate, startDate])

  // Update marked dates whenever tasks change
  useEffect(() => {
    updateMarkedDates()
  }, [tasks, selectedDate, startDate])

  const loadTasks = async (): Promise<void> => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks2')
      let tasksToSet;
      if (storedTasks !== null) {
        tasksToSet = JSON.parse(storedTasks);
      } else {
        tasksToSet = initialTasks;
        await AsyncStorage.setItem('tasks2', JSON.stringify(initialTasks))
      }
      console.log('Loading tasks:', tasksToSet); // Debug log
      setTasks(tasksToSet);
    } catch (error) {
      console.error('Failed to load tasks:', error)
      console.log('Falling back to initial tasks:', initialTasks); // Debug log
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
    
    // Filter by date range
    if (startDate && selectedDate) {
      filtered = filtered.filter(task => {
        const taskStart = moment(task.startDate);
        const taskEnd = moment(task.dueDate);
        const rangeStart = moment(startDate);
        const rangeEnd = moment(selectedDate);
        
        // Check if task date range overlaps with selected date range
        return (
          (taskStart.isSameOrAfter(rangeStart, 'day') && taskStart.isSameOrBefore(rangeEnd, 'day')) ||
          (taskEnd.isSameOrAfter(rangeStart, 'day') && taskEnd.isSameOrBefore(rangeEnd, 'day')) ||
          (taskStart.isSameOrBefore(rangeStart, 'day') && taskEnd.isSameOrAfter(rangeEnd, 'day'))
        );
      });
    } else if (selectedDate) {
      // If no start date is selected, filter by selected date only
      filtered = filtered.filter(task => 
        moment(selectedDate).isBetween(task.startDate, task.dueDate, 'day', '[]')
      );
    }
    
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
      const start = moment(task.startDate);
      const end = moment(task.dueDate);
      let current = start.clone();
      
      while (current.isSameOrBefore(end, 'day')) {
        const dateStr = current.format('YYYY-MM-DD');
        if (!dates[dateStr]) {
          dates[dateStr] = {
            marked: true,
            dotColor: task.completed ? '#10b981' : '#ef4444'
          };
        }
        current.add(1, 'day');
      }
    });
    
    // Mark selected range
    if (startDate && selectedDate) {
      const start = moment(startDate);
      const end = moment(selectedDate);
      let current = start.clone();
      
      while (current.isSameOrBefore(end, 'day')) {
        const dateStr = current.format('YYYY-MM-DD');
        dates[dateStr] = {
          ...dates[dateStr],
          selected: true,
          selectedColor: '#3b82f6'
        };
        current.add(1, 'day');
      }
    }
    
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
      startDate: newTask.startDate || selectedDate,
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
        marginHorizontal: 1,
        marginBottom: 12,
      }}
    >
      <View className="flex-1">
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
                  {item.startDate === item.dueDate 
                    ? formatDate(item.dueDate)
                    : `${formatDate(item.startDate)} - ${formatDate(item.dueDate)}`}
                </Text>
              </View>
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

  // Convert tasks to calendar events
  const calendarEvents = useMemo(() => {
    return initialTasks.map(task => ({
      title: task.title,
      start: moment(task.startDate).hour(0).minute(0).second(0).toDate(),
      end: moment(task.dueDate).startOf('day').toDate(),
      id: task.id,
      color: task.completed ? '#10b981' : task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f97316' : '#3b82f6'
    }));
  }, [tasks]);

  const handleEventPress = useCallback((event: CustomEvent) => {
    const task = tasks.find(t => t.id === event.id);
    if (task) {
      setSelectedTask(task);
      setModalVisible(true);
    }
  }, [tasks]);

  // Generate calendar grid for the month view
  const generateCalendarDays = () => {
    const firstDay = moment(currentMonth).startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startOffset = firstDay.day(); // 0 is Sunday
    
    // Generate array of days for the month view
    const days = [];
    
    // Add empty slots for days before the 1st of month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(moment(currentMonth).date(i));
    }
    
    return days;
  };

  const handleDateSelection = (date: moment.Moment) => {
    const formattedDate = date.format('YYYY-MM-DD');
    
    if (isSelectingStartDate) {
      setStartDate(formattedDate);
      setSelectedDate(formattedDate);
      setIsSelectingStartDate(false);
    } else {
      // Ensure end date is not before start date
      if (startDate && moment(formattedDate).isBefore(startDate)) {
        // If selected end date is before start date, swap them
        setSelectedDate(startDate);
        setStartDate(formattedDate);
      } else {
        setSelectedDate(formattedDate);
      }
      setShowCalendar(false);
      setIsSelectingStartDate(true);
    }
  };

  const renderCalendarDay = (day: moment.Moment | null, index: number) => {
    if (!day) {
      return <View key={`empty-${index}`} className="w-10 h-10 m-1" />;
    }
    
    const formattedDay = day.format('YYYY-MM-DD');
    const isSelected = selectedDate === formattedDay || startDate === formattedDay;
    const isToday = formattedDay === moment().format('YYYY-MM-DD');
    const isInRange = startDate && selectedDate && 
      moment(formattedDay).isBetween(startDate, selectedDate, 'day', '[]');
    
    return (
      <TouchableOpacity
        key={`day-${index}`}
        onPress={() => handleDateSelection(day)}
        className={`w-10 h-10 rounded-full m-1 items-center justify-center ${
          isSelected ? 'bg-blue-500' : 
          isInRange ? 'bg-blue-100' :
          isToday ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <Text className={`text-base ${
          isSelected ? 'text-white font-bold' : 
          isInRange ? 'text-blue-500' :
          isToday ? 'text-blue-500 font-bold' : 'text-gray-800'
        }`}>
          {day.format('D')}
        </Text>
      </TouchableOpacity>
    );
  };

  const changeMonth = (amount: number) => {
    setCurrentMonth(moment(currentMonth).add(amount, 'months'));
  };

  return (
    <FullLayout>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="#f5f5f5"
        />
        
        {/* Custom Header */}
        <View className="w-full px-5 pt-5 pb-2 ios:pt-20 flex-row justify-between items-center">
        <View className="flex-row items-center gap-1">
            <Image 
              source={require('../../assets/icons/TabIcon/clipboard.png')} 
              className="h-5 w-5" 
            />
            <Text className="text-xl font-semibold">Tasks</Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity 
              className={` py-2 px-4 rounded-full ${isCalendarView ? 'bg-blue-500' : ''}`}
              onPress={() => setIsCalendarView(!isCalendarView)}
            >
              <Text className={isCalendarView ? 'text-white' : ''}>
                {isCalendarView ? 'List View' : <CalendarDaysIcon size={24} color="#3b82f6" />}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() =>  handleDropDownTriggerPress('add')}
              className="p-2 rounded-full bg-blue-500"
            >
              <PlusIcon color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Calendar View */}
        {isCalendarView ? (
          <View className="flex-1 px-5 pt-2">
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1">
              {/* Calendar Header */}
              <View className="px-6 py-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm text-gray-500 mb-1">
                      {moment(currentCalendarDate).format('YYYY')}
                    </Text>
                    <Text className="text-2xl font-bold text-gray-800">
                      {moment(currentCalendarDate).format('MMMM')}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-2">
                    <TouchableOpacity 
                      className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200"
                      onPress={handlePreviousMonth}
                    >
                      <Text className="text-gray-600 font-medium px-1">←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200"
                      onPress={handleNextMonth}
                    >
                      <Text className="text-gray-600 font-medium px-1">→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              {/* Calendar */}
              <View className="flex-1 p-4">
                {/* Debug view */}
                {/* <Text>Events: {calendarEvents.map((event) => `\n${event.title}: ${event.start} - ${event.end}`)}</Text> */}
                
                <BigCalendar
                  events={calendarEvents}
                  height={Dimensions.get('window').height - 180}
                  mode="month"
                  showTime={false}
                  swipeEnabled={false}
                  onPressEvent={handleEventPress}
                  date={currentCalendarDate}
                  eventCellStyle={(event: CustomEvent) => ({
                    backgroundColor: event.color,
                    borderRadius: 8,
                    padding: 4,
                    marginVertical: 2,
                    opacity: 0.9,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 1
                    
                  })}
                />
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* Search Bar - Only show in list view */}
            <View className="my-2 w-screen px-5 ios:mt-2">  
              <View className="w-full py-1 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center">
                <MagnifyingGlassIcon color="#9ca3af" size={18} />
                <TextInput
                  placeholder="Search tasks..."
                  className="flex-1 mx-1 py-1.5"
                  placeholderTextColor="#9ca3af"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={{ fontSize: 16, color: '#374151' }}
                />
                
              </View>
            </View>

            {/* Selected Date Display */}
            <View className="px-5 my-2 flex-row justify-between items-center">
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <CalendarDaysIcon color="#6b7280" size={20} />
                  <Text className="text-sm font-medium text-gray-800 ml-2">
                    {startDate ? `${formatDate(startDate)} ` : 'Start Date'}
                  </Text>
                </View>
                {startDate && (
                  <View className="flex-row items-center">
                    <Text className="text-sm font-medium text-gray-800">
                      {selectedDate === '' || selectedDate === startDate ? '' : `- ${formatDate(selectedDate)}`}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                onPress={() => setShowCalendar(true)}
                className="flex-row items-center bg-blue-50 px-3 py-1 rounded-lg"
              >
                <CalendarDaysIcon size={16} color="#3b82f6" />
                <Text className="ml-1 text-blue-500 font-medium">Calendar</Text>
              </TouchableOpacity>
            </View>

            {/* Task List */}
            <View className="flex-1 px-5 pt-2">
              {/* Existing Task List Code */}
              {filteredTasks.length > 0 ? (
                // <SwipeListView
                //   ref={swipeListRef}
                //   data={filteredTasks}
                //   renderItem={renderItem}
                //   keyExtractor={(item: Task) => item.id}
                //   closeOnRowPress={true}
                //   onRowDidOpen={onRowDidOpen}
                //   renderHiddenItem={({ item }) => (
                //     <View className="flex-1 flex-row justify-between items-center px-2 py-3">
                //       {/* Left Action (Complete) */}
                //       <TouchableOpacity
                //         className="h-full justify-center bg-green-500 rounded-xl px-6"
                //         onPress={() => handleToggleComplete(item.id)}
                //       >
                //         <CheckIcon color="white" size={24} />
                //       </TouchableOpacity>
                      
                //       {/* Right Action (Delete) */}
                //       <TouchableOpacity
                //         className="h-full justify-center bg-red-500 rounded-xl px-6"
                //         onPress={() => handleDeleteTask(item.id)}
                //       >
                //         <TrashIcon color="white" size={24} />
                //       </TouchableOpacity>
                //     </View>
                //   )}
                //   leftOpenValue={90}
                //   rightOpenValue={-90}
                //   previewRowKey={filteredTasks[0]?.id}
                //   previewOpenValue={-40}
                //   previewOpenDelay={3000}
                //   friction={10}
                //   tension={40}
                //   swipeToOpenPercent={20}
                //   swipeToOpenVelocityContribution={10}
                //   onRowClose={() => setOpenRowKey(null)}
                //   useNativeDriver={true}
                //   stopRightSwipe={-90}
                //   stopLeftSwipe={90}
                // />
                <FlatList
                  data={filteredTasks}
                  renderItem={renderItem}
                  keyExtractor={(item: Task) => item.id}
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
          </>
        )}

        {/* Task Modal */}
        <TaskModal />

        {/* Calendar Modal */}
        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowCalendar(false);
            setIsSelectingStartDate(true);
          }}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-11/12 rounded-2xl p-4 shadow-xl">
              {/* Calendar Header */}
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
                  <ChevronLeftIcon size={20} color="#374151" />
                </TouchableOpacity>
                
                <View>
                  <Text className="text-lg font-bold text-gray-800 text-center">
                    {currentMonth.format('MMMM YYYY')}
                  </Text>
                  <Text className="text-sm text-gray-500 text-center mt-1">
                    {isSelectingStartDate ? 'Select start date' : 'Select end date'}
                  </Text>
                </View>
                
                <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
                  <ChevronRightIcon size={20} color="#374151" />
                </TouchableOpacity>
              </View>
              
              {/* Weekday Headers */}
              <View className="flex-row justify-around mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                  <Text key={day} className="text-center w-10 text-gray-500 font-medium">
                    {day}
                  </Text>
                ))}
              </View>
              
              {/* Calendar Grid */}
              <View className="flex-row flex-wrap justify-around">
                {generateCalendarDays().map((day, index) => renderCalendarDay(day, index))}
              </View>
              
              {/* Action Buttons */}
              <View className="flex-row justify-end mt-4 border-t border-gray-100 pt-4">
                <TouchableOpacity 
                  onPress={() => {
                    const today = moment().format('YYYY-MM-DD');
                    if (isSelectingStartDate) {
                      setStartDate(today);
                      setSelectedDate(today);
                      setIsSelectingStartDate(false);
                    } else {
                      setSelectedDate(today);
                      setShowCalendar(false);
                      setIsSelectingStartDate(true);
                    }
                    setCurrentMonth(moment());
                  }}
                  className="px-4 py-2 mr-2"
                >
                  <Text className="text-blue-500 font-medium">Today</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setShowCalendar(false);
                    setIsSelectingStartDate(true);
                  }}
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">
                    {isSelectingStartDate ? 'Cancel' : 'Done'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </FullLayout>
  )
}

export default Task2