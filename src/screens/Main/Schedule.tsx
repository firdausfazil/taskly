import { 
  Image, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
  Modal
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import FullLayout from '../../layout/FullLayout'
import { PlusIcon } from 'react-native-heroicons/solid';
import { FlashList } from '@shopify/flash-list';
import { dailyScheduleData } from '../../data/dashboardData';
import ScheduleCard from '../../components/Schedule/ScheduleCard';
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon
} from 'react-native-heroicons/outline';

// Import moment for date handling
import moment from 'moment';

type Schedule = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  isCompleted: boolean;
};

export default function Schedule({navigation}: {navigation: any}) {
  const [allSchedule, setAllSchedule] = useState<Schedule[]>([]);
  const [filteredSchedule, setFilteredSchedule] = useState<Schedule[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  
  // Get visible dates for the horizontal date picker
  const visibleDates = Array.from({ length: 31 }, (_, i) => moment().add(i - 15, 'days'));
  
  useEffect(() => {
    fetchScheduleData();
  }, [selectedDate]);
  
  const fetchScheduleData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        setAllSchedule(dailyScheduleData);
        setFilteredSchedule(dailyScheduleData);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchScheduleData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter schedules based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredSchedule(allSchedule);
    } else {
      const filtered = allSchedule.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSchedule(filtered);
    }
  }, [searchText, allSchedule]);

  const clearSearch = () => {
    setSearchText('');
  };

  const renderDateItem = (date: moment.Moment, index: number) => {
    const day = date.format('D');
    const dayName = date.format('ddd');
    const isSelected = selectedDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    const isToday = date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedDate(date)}
        className={`items-center justify-center px-2.5 py-2 rounded-lg mx-0.5 ${
          isSelected ? 'bg-blue-500' : isToday ? 'bg-blue-50' : 'bg-transparent'
        }`}
      >
        <Text className={`text-xs font-medium ${isSelected ? 'text-white' : isToday ? 'text-blue-500' : 'text-gray-400'}`}>
          {dayName}
        </Text>
        <Text className={`text-base font-semibold ${isSelected ? 'text-white' : isToday ? 'text-blue-500' : 'text-gray-800'}`}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

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

  const renderCalendarDay = (day: moment.Moment | null, index: number) => {
    if (!day) {
      return <View key={`empty-${index}`} className="w-10 h-10 m-1" />;
    }
    
    const isSelected = selectedDate.format('YYYY-MM-DD') === day.format('YYYY-MM-DD');
    const isToday = day.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    
    return (
      <TouchableOpacity
        key={`day-${index}`}
        onPress={() => {
          setSelectedDate(day);
          setShowCalendar(false);
        }}
        className={`w-10 h-10 rounded-full m-1 items-center justify-center ${
          isSelected ? 'bg-blue-500' : isToday ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <Text className={`text-base ${
          isSelected ? 'text-white font-bold' : 
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

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-5">
      <Image 
        source={require('../../assets/icons/TabIcon/schedule.png')} 
        className="h-16 w-16 opacity-30 mb-4" 
        resizeMode="contain"
      />
      <Text className="text-xl font-semibold text-gray-400 mb-2">No schedules found</Text>
      <Text className="text-sm text-gray-400 text-center mb-6">
        {searchText.trim() !== '' 
          ? `No results matching "${searchText}"`
          : "You don't have any schedules for this day yet"}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddSchedule')}
        className="bg-blue-500 py-3 px-5 rounded-xl flex-row items-center"
      >
        <PlusIcon color="white" size={20} />
        <Text className="text-white font-medium ml-2">Add New Schedule</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className='flex-1 bg-white'>
        <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
      />
      {/* Header */}
      <View className="w-screen pt-6 pb-2 px-5 bg-white shadow-sm" style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60}}>
        <View className="w-full flex-row justify-between items-center">
          <View className="flex-row items-center gap-1">
            <Image 
              source={require('../../assets/icons/TabIcon/schedule.png')} 
              className="h-5 w-5" 
            />
            <Text className="text-xl font-semibold">Schedule</Text>
          </View>
          
          <View className="flex-row gap-2">
            {!showSearch && (
              <TouchableOpacity 
                onPress={() => setShowSearch(true)}
                className="p-2 rounded-full bg-gray-100"
              >
                <MagnifyingGlassIcon color="#374151" size={20} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddSchedule')}
              className="p-2 rounded-full bg-blue-500"
            >
              <PlusIcon color="white" size={20} />
            </TouchableOpacity>

          </View>
        </View>
        
        {/* Date Display and Calendar Button */}
        <View className="flex-row items-center justify-between mt-4 mb-2">
          <Text className="text-lg font-semibold text-gray-800">
            {selectedDate.format('dddd, MMMM D')}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowCalendar(true)}
            className="flex-row items-center bg-blue-50 px-3 py-1 rounded-lg"
          >
            <CalendarDaysIcon size={16} color="#3b82f6" />
            <Text className="ml-1 text-blue-500 font-medium">Calendar</Text>
          </TouchableOpacity>
        </View>
        
        {/* Date Selector */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-2"
          contentContainerStyle={{ paddingHorizontal: 2 }}
          snapToInterval={50}
          decelerationRate="fast"
        >
          {visibleDates.map((date, index) => renderDateItem(date, index))}
        </ScrollView>
      </View>
      
      {/* Search Bar */}
      {showSearch && (
        <View className="px-5 py-3 bg-white border-b border-gray-100 flex-row justify-between items-center">
          <View className="py-2 bg-gray-100 rounded-xl px-4 flex-row gap-2 items-center w-11/12">
            <MagnifyingGlassIcon color="#6b7280" size={18} />
            <TextInput
              placeholder="Search schedules..."
              className="flex-1"
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              style={{ fontSize: 16, color: '#374151' }}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <XMarkIcon color="#6b7280" size={18} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => setShowSearch(false)}>
            <XCircleIcon color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : filteredSchedule.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlashList
          data={filteredSchedule}
          renderItem={({item}) => <ScheduleCard dailySchedule={item} />}
          keyExtractor={({ id }) => id.toString()}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3b82f6"]}
            />
          }
        />
      )}

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-2xl p-4 shadow-xl">
            {/* Calendar Header */}
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
                <ChevronLeftIcon size={20} color="#374151" />
              </TouchableOpacity>
              
              <Text className="text-lg font-bold text-gray-800">
                {currentMonth.format('MMMM YYYY')}
              </Text>
              
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
                  setSelectedDate(moment());
                  setCurrentMonth(moment());
                  setShowCalendar(false);
                }}
                className="px-4 py-2 mr-2"
              >
                <Text className="text-blue-500 font-medium">Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowCalendar(false)}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({})