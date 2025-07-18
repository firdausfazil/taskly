import { Text, View, Dimensions, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Platform, Image } from 'react-native'
import React, { useState } from 'react'
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit'
import { ArrowUpIcon, ArrowDownIcon, ChartBarIcon, CheckCircleIcon, ClockIcon } from 'react-native-heroicons/outline'
import { ChartBarSquareIcon } from 'react-native-heroicons/solid'

export default function Report() {
  const [activeTimeframe, setActiveTimeframe] = useState('month')

  // Enhanced data with more meaningful information
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(56, 161, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Tasks Completed']
  }

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [10, 15, 8, 12, 18, 5, 3],
        color: (opacity = 1) => `rgba(56, 161, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Tasks Completed']
  }

  // Task completion by category
  const categoryData = {
    labels: ['Work', 'Personal', 'Study', 'Health', 'Other'],
    datasets: [
      {
        data: [30, 25, 15, 20, 10],
        colors: [
          (opacity = 1) => `rgba(56, 161, 243, ${opacity})`,
          (opacity = 1) => `rgba(255, 148, 77, ${opacity})`,
          (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
          (opacity = 1) => `rgba(76, 217, 100, ${opacity})`,
          (opacity = 1) => `rgba(178, 178, 178, ${opacity})`,
        ]
      },
    ],
  }

  // Task status data
  const statusData = [
    {
      name: 'Completed',
      population: 45,
      color: '#38A1F3',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'In Progress',
      population: 28,
      color: '#FF9E2C',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Pending',
      population: 27,
      color: '#7B61FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ]

  // Progress data (productivity score)
  const progressData = {
    labels: ['Productivity', 'Consistency', 'On-time', 'Efficiency'],
    data: [0.8, 0.6, 0.9, 0.7]
  }

  const timeframeButtons = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
  ]

  const screenWidth = Dimensions.get('window').width
  
  // Get active data based on timeframe
  const getActiveData = () => {
    return activeTimeframe === 'week' ? weeklyData : monthlyData
  }

  // Quick stats data
  const quickStats = [
    { title: 'Tasks Completed', value: '45', change: '+12%', isPositive: true, icon: <CheckCircleIcon size={22} color="#38A1F3" /> },
    { title: 'Avg. Completion Time', value: '2.3', unit: 'days', change: '-8%', isPositive: true, icon: <ClockIcon size={22} color="#FF9E2C" /> },
    { title: 'Productivity Score', value: '76', unit: '/100', change: '+5%', isPositive: true, icon: <ChartBarIcon size={22} color="#7B61FF" /> },
  ]

  // Modern chart config with gradients
  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(56, 161, 243, ${opacity})`,
    labelColor: (opacity = 0.8) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#38A1F3'
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: "rgba(0, 0, 0, 0.05)",
    }
  }
  
  const progressChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
      />
      
      {/* Header */}
      <View className="w-screen pt-6 pb-2 px-5 bg-white shadow-sm" style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60}}>
        <View className="w-full flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <ChartBarSquareIcon size={20} color="#38A1F3" />
            <Text className="text-xl font-semibold">Analytics</Text>
          </View>
          
          <View className="bg-blue-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-medium">76% Efficient</Text>
          </View>
        </View>
      </View>
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Modern Button Group Timeframe Selector */}
        <View className="mx-5 mt-4 mb-6">
          <Text className="text-gray-400 text-xs mb-2 font-medium">DATA TIMEFRAME</Text>
          <View className="flex-row">
            {timeframeButtons.map((button, index) => (
              <TouchableOpacity
                key={button.id}
                onPress={() => setActiveTimeframe(button.id)}
                className={`
                  ${index === 0 ? 'rounded-l-lg' : ''}
                  ${index === timeframeButtons.length - 1 ? 'rounded-r-lg' : ''}
                  ${activeTimeframe === button.id 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'}
                  py-3 flex-1
                `}
              >
                <Text 
                  className={`text-center font-medium ${
                    activeTimeframe === button.id 
                      ? 'text-white' 
                      : 'text-gray-600'
                  }`}
                >
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Container */}
        <View className="px-5">
          {/* Quick Stats Cards */}
          <View className="flex-row flex-wrap justify-between mb-5">
            {quickStats.map((stat, index) => (
              <View key={index} className="w-[31%] bg-white rounded-2xl p-3 mb-3 shadow-sm border border-gray-100">
                <View className="mb-2">
                  {stat.icon}
                </View>
                <Text className="text-gray-600 text-xs mb-1">{stat.title}</Text>
                <View className="flex-row items-end justify-between">
                  <Text className="text-gray-800 text-lg font-bold">
                    {stat.value}
                    {stat.unit && <Text className="text-gray-500 text-sm font-normal">{stat.unit}</Text>}
                  </Text>
                  <View className={`flex-row items-center px-1 py-0.5 rounded ${stat.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stat.isPositive ? 
                      <ArrowUpIcon size={12} color="#4CD964" /> : 
                      <ArrowDownIcon size={12} color="#FF3B30" />
                    }
                    <Text className={`text-[10px] ml-0.5 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Task Completion Trend */}
        <View className="mx-5 mb-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="mb-3">
            <Text className="text-gray-800 text-lg font-semibold">Task Completion Trend</Text>
            <Text className="text-gray-500 text-xs mt-0.5">+18% from previous period</Text>
          </View>
          <LineChart
            data={getActiveData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16, marginVertical: 8 }}
            fromZero
            withShadow={false}
            withInnerLines={true}
            withOuterLines={true}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withDots={true}
            segments={5}
          />
        </View>

        {/* Productivity Score */}
        <View className="mx-5 mb-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="mb-3">
            <Text className="text-gray-800 text-lg font-semibold">Productivity Score</Text>
            <Text className="text-gray-500 text-xs mt-0.5">76/100 overall</Text>
          </View>
          <ProgressChart
            data={progressData}
            width={screenWidth - 40}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={progressChartConfig}
            hideLegend={false}
            style={{ borderRadius: 16, marginVertical: 8 }}
          />
        </View>

        {/* Task Distribution by Category */}
        <View className="mx-5 mb-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="mb-3">
            <Text className="text-gray-800 text-lg font-semibold">Tasks by Category</Text>
            <Text className="text-gray-500 text-xs mt-0.5">Distribution of completed tasks</Text>
          </View>
          <BarChart
            data={categoryData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={{ borderRadius: 16, marginVertical: 8 }}
            verticalLabelRotation={30}
            fromZero
            showBarTops={false}
            showValuesOnTopOfBars={true}
            withInnerLines={false}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>

        {/* Task Status */}
        <View className="mx-5 mb-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="mb-3">
            <Text className="text-gray-800 text-lg font-semibold">Task Status Overview</Text>
            <Text className="text-gray-500 text-xs mt-0.5">Current distribution of all tasks</Text>
          </View>
          <PieChart
            data={statusData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={{ borderRadius: 16, marginVertical: 8 }}
            absolute
            hasLegend={true}
            center={[screenWidth / 6, 0]}
          />
        </View>
      </ScrollView>
    </View>
  )
}