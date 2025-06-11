/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Provider, useDispatch, useSelector } from "react-redux"
//import { store, RootState } from "./src/redux/store/store";
import { getTheme } from './src/Storage';

import { useColorScheme } from 'nativewind';



import "./global.css"
import Start from './src/screens/Start';
import Onboarding from './src/screens/Onboarding';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Dashbaord from './src/screens/Main/DashboardUser2';
import Settings from './src/screens/Main/Settings';
import { Cog8ToothIcon, EllipsisVerticalIcon, HomeIcon, PlusSmallIcon } from 'react-native-heroicons/outline';
import { ClipboardDocumentListIcon, Cog8ToothIcon as Cog8ToothIconSolid, HomeIcon as HomeIconSolid } from 'react-native-heroicons/solid';
import Task from './src/screens/Main/Task';
import Schedule from './src/screens/Main/Schedule';
import Report from './src/screens/Main/Report';
import { deviceHeight } from './src/constant/DeviceDimension';
import { Header } from 'react-native/Libraries/NewAppScreen';
import HeaderMenu from './src/components/Task/HeaderMenu';
import TaskStack from './src/screens/Main/TaskStack';
import Task2 from './src/screens/Main/Task2';
import store from './src/redux/store/store';
import AddSchedule from './src/screens/Schedule/AddSchedule';
import AddTask from './src/screens/Main/AddTask';
import EditTask from './src/screens/Main/EditTask';


const Tab = createBottomTabNavigator();
function MyTabs(): React.JSX.Element {

  

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        animation: 'fade',
        tabBarStyle: {paddingTop:5, paddingHorizontal:10},
        tabBarLabelStyle: {marginTop:4}
      }} 
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashbaord} 
        options={{
          tabBarLabel: ({focused}) => (
            <Text className={`text-xs ${focused ? 'text-blue-500' : 'text-gray-500'}`}>
              Dashboard
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? 
                (
                  <Image source={require('./src/assets/icons/TabIcon/home-fill.png')} className='h-7 w-7' />
                ) 
              : 
                (
                  <Image source={require('./src/assets/icons/TabIcon/home.png')} className='h-7 w-7' />
                )
              }  
            </View>
          )
        }} 
      />

      <Tab.Screen 
        name="Schedule" 
        component={Schedule}  
        options={{
          tabBarLabel: ({focused}) => (
            <Text className={`text-xs ${focused ? 'text-blue-500' : 'text-gray-500'}`}>
              Schedule
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (<Image source={require('./src/assets/icons/TabIcon/schedule-fill.png')} className='h-7 w-7' />) : (<Image source={require('./src/assets/icons/TabIcon/schedule.png')} className='h-7 w-7' />)}  
            </View>
          )
        }}
      />


      <Tab.Screen 
        name="TaskTab" 
        component={Task2}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
                <Image source={require('./src/assets/icons/TabIcon/clipboard-fill.png')} className='h-7 w-7' />
              ) : (
                <Image source={require('./src/assets/icons/TabIcon/clipboard.png')} className='h-7 w-7' />
              )}
            </View>
          ),
        }}
      />


      {/* <Tab.Screen 
        name="Task" 
        component={Task} 
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle:{
            backgroundColor: "#d6d6c3",
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 1.5,
            elevation: 5,
          },
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
          // headerLeft: () => (
          //   <TouchableOpacity className='pl-3 justify-center items-center flex-row gap-1'>
          //     <Image source={require('./src/assets/icons/TabIcon/clipboard.png')} className='h-6 w-6' />
          //     <Text className='text-xl font-semibold'>Current Task</Text>
          //   </TouchableOpacity>
          // ),

          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (<Image source={require('./src/assets/icons/TabIcon/clipboard-fill.png')} className='h-7 w-7' />) : (<Image source={require('./src/assets/icons/TabIcon/clipboard.png')} className='h-7 w-7' />)}  
            </View>
          )
        }}
      /> */}

      <Tab.Screen 
        name="Report" 
        component={Report} 
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (<Image source={require('./src/assets/icons/TabIcon/statistics-fill.png')} className='h-7 w-7' />) : (<Image source={require('./src/assets/icons/TabIcon/statistics.png')} className='h-7 w-7' />)}  
            </View>
          )
        }}
      />

      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (<Image source={require('./src/assets/icons/TabIcon/settings-fill.png')} className='h-7 w-7' />) : (<Image source={require('./src/assets/icons/TabIcon/settings.png')} className='h-7 w-7' />)}  
            </View>
          )
        }}
      />

      
    </Tab.Navigator>
  );
}


const Stack = createNativeStackNavigator();
function RootStack(): React.JSX.Element {

  //const mode = useSelector((state:RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const { setColorScheme } = useColorScheme();



  // For manipulating theme
  useEffect(() => {
    const isValidTheme = (theme: string): theme is "light" | "dark" | "system" => {
      return ["light", "dark", "system"].includes(theme);
    };

    const savedTheme = getTheme() || 'light';
    setColorScheme(isValidTheme(savedTheme) ? savedTheme : "light");


  })

  return (
    <Stack.Navigator initialRouteName='Start' screenOptions={{
      contentStyle: { backgroundColor: getTheme() === "dark" ? "#121212" : "#ffffff" },
      headerShown: false
    }}>
      <Stack.Screen name='Start' component={Start} />
      <Stack.Screen name='Onboarding' component={Onboarding} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Register' component={Register}  />
      <Stack.Screen name='Main' component={MyTabs} />
      <Stack.Screen name='AddSchedule' component={AddSchedule} />
      <Stack.Screen name='AddTask' component={AddTask} />
      <Stack.Screen name='EditTask' component={EditTask} />
      
    </Stack.Navigator>
  )
}



function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
      </Provider>
    
  );
}


export default App;
