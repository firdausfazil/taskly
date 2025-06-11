import { View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import CustomText from '../constant/CustomText'
import { useDispatch } from 'react-redux'
//import { toggleTheme } from '../redux/slices/themeSlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated'
import OnboardingPagination from '../components/OnboardingPagination'
import OnboardingCustomButton from '../components/OnboardingCustomButton'
import LinearGradient from 'react-native-linear-gradient'

const {width, height}  = Dimensions.get('window')



const slides = [
  {
    id: '1',
    image: require('../assets/images/onboarding3.png'),
    title: 'Welcome to Taskly',
    subtitle: `Taskly is your ultimate task management solution, designed to help you stay organized and maximize your productivity. Easily create, prioritize, and track tasks with an intuitive interface. Whether you're managing personal goals or team projects, Taskly ensures that everything stays on schedule and nothing gets overlooked.`,
  },
  {
    id: '2',
    image: require('../assets/images/onboarding2.png'),
    title: 'Seamless Collaboration',
    subtitle: `Work together effortlessly with Taskly’s powerful collaboration features. Assign tasks, set deadlines, and share real-time updates with your team. With built-in notifications and progress tracking, everyone stays aligned, ensuring smooth execution of tasks without confusion or delays.`,
  },
  {
    id: '3',
    image: require('../assets/images/onboarding3.png'),
    title: 'Smart Task Management',
    subtitle: `Taskly makes productivity effortless with smart task management tools. Categorize tasks, automate reminders, and customize workflows to suit your needs. With intuitive progress tracking and deadline management, Taskly helps you focus on what matters most, making task management more efficient and stress-free.`,
  },
];

const gradientColors = [
  ['#b0b098', '#f7f5f3'], // Slide 1
  ['#b0b098', '#f7f5f3'],     // Slide 2
  ['#b0b098', '#f7f5f3'],   // Slide 3
];


const Onboarding = ({navigation}: any) => {

  const dispatch = useDispatch();
  

  const x = useSharedValue(0);
  const flatListRef = useAnimatedRef<FlatList<any>>();
  const flatListIndex = useSharedValue(0);
  

  const onViewableItemChanged = ({viewableItems}: any) => {
    flatListIndex.value = viewableItems[0].index
    console.log(viewableItems[0].index)
  }



  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
      console.log(event.contentOffset.x);
    }
    
  })


  const animatedGradientColors = useDerivedValue(() => {
    const startColor = interpolateColor(
      x.value,
      slides.map((_, i) => i * width), // Scroll positions
      gradientColors.map(colors => colors[0]) // Start colors
    );
  
    const endColor = interpolateColor(
      x.value,
      slides.map((_, i) => i * width), // Scroll positions
      gradientColors.map(colors => colors[1]) // End colors
    );
  
    return [startColor, endColor];
  });

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedGradientColors.value[1], // Only used for fallback
    };
  });
  
  


  const RenderItem = ({item, index}: any) => {

    const imageAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(x.value,
        [
          (index-1)*width,
          index*width,
          (index+1)*width,
        ],
        [0,1,0],
        Extrapolation.CLAMP,
      );
      const translateYAnimation = interpolate(x.value,
        [
          (index-1)*width,
          index*width,
          (index+1)*width,
        ],
        [100,0,100],
        Extrapolation.CLAMP,
      );
      return {
        opacity: opacityAnimation,
        width: width*0.8,
        height: width*0.8,
        transform: [{translateY: translateYAnimation}],
      }
    })

    const textAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(x.value,
        [
          (index-1)*width,
          index*width,
          (index+1)*width,
        ],
        [0,1,0],
        Extrapolation.CLAMP,
      );
      const translateYAnimation = interpolate(x.value,
        [
          (index-1)*width,
          index*width,
          (index+1)*width,
        ],
        [100,0,100],
        Extrapolation.CLAMP,
      );
      return {
        opacity: opacityAnimation,
        width: width*0.8,
        height: width*0.8,
        transform: [{translateY: translateYAnimation}],
      }
    })

    return <View className='justify-between items-center bg-transparent w-screen'>
      <Animated.Image source={item.image} style={imageAnimationStyle} />
      <Animated.View style={textAnimationStyle}>
        <CustomText content={item.title}className='text-center font-bold text-2xl mb-5' />
        <CustomText content={item.subtitle} className='text-justify  leading-6' />
      </Animated.View>
    </View>
  }





  return (
    <Animated.View style={[{ flex: 1 }]}>
      <LinearGradient style={{ flex: 1 }}  colors={animatedGradientColors.value}>
        <SafeAreaView className='flex-1 '>
              {/* <TouchableOpacity onPress={() => navigation.navigate('Start')}>
                <CustomText content='Onboarding' className='font-bold text-2xl' />
            </TouchableOpacity>

            <TouchableOpacity className='mt-7' onPress={() => dispatch(toggleTheme())}>
              <CustomText content='Change Theme' />
            </TouchableOpacity> */}
            <View className='w-screen px-7 mb-10 flex-row justify-between items-center'>
              <Image source={require('../assets/logo/taskly_logo.png')} style={{ width: 160, height: 50 }} />

              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <CustomText content='Skip' className='text-xl' />
              </TouchableOpacity>
              
            </View>
            
          
            <Animated.FlatList
              ref={flatListRef}
              onScroll={onScroll}
              data={slides}
              renderItem={({item, index}) => {
                return <RenderItem item={item} index={index} />;
              }}
              keyExtractor={item => item.id}
              scrollEventThrottle={16}
              horizontal={true}
              bounces={false}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemChanged}
              viewabilityConfig={{
                minimumViewTime: 300,
                viewAreaCoveragePercentThreshold: 10,
              }}
            />

          <View className='flex-row justify-between items-center mx-7 my-5 '>
            <OnboardingPagination data={slides} x={x} screenWidth={width}  />
            <OnboardingCustomButton 
              flatListRef={flatListRef} 
              flatListIndex={flatListIndex} 
              dataLength={slides.length} 
              navigation={navigation}
            />
          </View>

        </SafeAreaView>
      </LinearGradient>  
    </Animated.View>
  )
}

export default Onboarding