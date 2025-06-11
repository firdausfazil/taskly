import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Task from './Task';
import Task2 from './Task2';
import AddTask from './AddTask';
import { Image, Text, TouchableOpacity } from 'react-native';

const NativeStack = createNativeStackNavigator();

export default function TaskStack() {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="Task"
        component={Task}
        options={{
            headerTitle: '',
            headerStyle: {
                backgroundColor: "#d6d6c3",
            },
            headerShadowVisible: false, // optional: removes bottom border
            // headerLeft: () => (
            //     <TouchableOpacity className='pl-0 justify-center items-center flex-row gap-1'>
            //         <Image source={require('../../../src/assets/icons/TabIcon/clipboard.png')} className='h-6 w-6' />
            //         <Text className='text-xl font-semibold'>Current Task</Text>
            //     </TouchableOpacity>
            // ),
        }}
      />
      <NativeStack.Screen
        name="Task2"
        component={Task2}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerShadowVisible: false,
        }}
      />
      <NativeStack.Screen
        name="AddTask"
        component={AddTask}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerShadowVisible: false,
        }}
      />
    </NativeStack.Navigator>
  );
}
