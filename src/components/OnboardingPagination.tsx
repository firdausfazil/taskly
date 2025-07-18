import { View, ViewStyle, Dimensions } from 'react-native';
import React from 'react';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue
} from 'react-native-reanimated';

// Define props type
interface OnboardingPaginationProps {
    data: any[];  // Replace `any[]` with a specific type if `data` has a known structure
    x: SharedValue<number>;
    screenWidth: number;
}

// Define props for PaginationComp
interface PaginationCompProps {
    i: number;
    x: SharedValue<number>;
    screenWidth: number;
}

const PaginationComp: React.FC<PaginationCompProps> = ({ i, x, screenWidth }) => {
    const animatedDotStyle = useAnimatedStyle<ViewStyle>(() => {
        const widthAnimation = interpolate(
            x.value,
            [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
            [10, 20, 10],
            Extrapolation.CLAMP
        );
        const opacityAnimation = interpolate(
            x.value,
            [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        );

        return {
            width: widthAnimation,
            opacity: opacityAnimation
        };
    });

    return (
        <Animated.View
            style={[
                { width: 10, height: 10, backgroundColor: '#b0b098', marginHorizontal: 10, borderRadius: 10 },
                animatedDotStyle
            ]}
        />
    );
};

const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({ data, x, screenWidth }) => {
    return (
        <View className="flex-row h-10 justify-center items-center">
            {data.map((_, i) => (
                <PaginationComp key={i} i={i} x={x} screenWidth={screenWidth} />
            ))}
        </View>
    );
};

export default OnboardingPagination;
