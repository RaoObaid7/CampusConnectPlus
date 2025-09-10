import React, { useState, useRef, useEffect } from 'react';
import { 
  Animated, 
  PanGestureHandler, 
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { animation, transforms3D } from '../utils/designSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Micro-interaction hook for press animations
export const usePressAnimation = (initialScale = 1, pressScale = 0.95, duration = 150) => {
  // Ensure scale values are valid numbers
  const safeInitialScale = typeof initialScale === 'number' && initialScale > 0 ? initialScale : 1;
  const safePressScale = typeof pressScale === 'number' && pressScale > 0 ? pressScale : 0.95;
  const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 150;
  
  const animatedValue = useRef(new Animated.Value(safeInitialScale)).current;
  const [pressed, setPressed] = useState(false);

  const animateIn = () => {
    setPressed(true);
    Animated.spring(animatedValue, {
      toValue: safePressScale,
      duration: safeDuration,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    setPressed(false);
    Animated.spring(animatedValue, {
      toValue: safeInitialScale,
      duration: safeDuration,
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedValue,
    pressed,
    animateIn,
    animateOut,
    animatedStyle: {
      transform: [{ scale: animatedValue }],
    },
  };
};

// Floating animation hook
export const useFloatingAnimation = (
  duration = 3000,
  distance = 10,
  autoStart = true
) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const startFloating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -distance,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (autoStart) {
      startFloating();
    }
  }, [autoStart]);

  return {
    translateY,
    startFloating,
    animatedStyle: {
      transform: [{ translateY }],
    },
  };
};

// Pulse animation hook
export const usePulseAnimation = (
  minScale = 1,
  maxScale = 1.05,
  duration = 1000,
  autoStart = true
) => {
  const scaleValue = useRef(new Animated.Value(minScale)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: maxScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: minScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (autoStart) {
      startPulse();
    }
  }, [autoStart]);

  return {
    scaleValue,
    startPulse,
    animatedStyle: {
      transform: [{ scale: scaleValue }],
    },
  };
};

// Wiggle animation hook
export const useWiggleAnimation = (
  rotation = 5,
  duration = 300,
  repeatCount = 3
) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const startWiggle = () => {
    const rotateAnimations = [];
    for (let i = 0; i < repeatCount; i++) {
      rotateAnimations.push(
        Animated.timing(rotateValue, {
          toValue: rotation * (i % 2 === 0 ? 1 : -1),
          duration: duration / repeatCount,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    }
    rotateAnimations.push(
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: duration / repeatCount,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    Animated.sequence(rotateAnimations).start();
  };

  const animatedStyle = {
    transform: [
      {
        rotate: rotateValue.interpolate({
          inputRange: [-rotation, rotation],
          outputRange: [`-${rotation}deg`, `${rotation}deg`],
        }),
      },
    ],
  };

  return {
    rotateValue,
    startWiggle,
    animatedStyle,
  };
};

// Bounce animation hook
export const useBounceAnimation = (
  bounceHeight = 20,
  duration = 600,
  bounceCount = 3
) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const startBounce = () => {
    const bounceAnimations = [];
    for (let i = 0; i < bounceCount; i++) {
      const currentHeight = bounceHeight * (1 - i / bounceCount);
      bounceAnimations.push(
        Animated.timing(translateY, {
          toValue: -currentHeight,
          duration: duration / (bounceCount * 2),
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration / (bounceCount * 2),
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        })
      );
    }

    Animated.sequence(bounceAnimations).start();
  };

  return {
    translateY,
    startBounce,
    animatedStyle: {
      transform: [{ translateY }],
    },
  };
};

// Slide in animation hook
export const useSlideInAnimation = (
  direction = 'right',
  distance = screenWidth,
  duration = 500,
  autoStart = true
) => {
  const translateX = useRef(new Animated.Value(
    direction === 'right' ? distance : direction === 'left' ? -distance : 0
  )).current;
  const translateY = useRef(new Animated.Value(
    direction === 'up' ? distance : direction === 'down' ? -distance : 0
  )).current;

  const slideIn = () => {
    Animated.parallel([
      direction === 'left' || direction === 'right' 
        ? Animated.timing(translateX, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.back(1.7)),
            useNativeDriver: true,
          })
        : null,
      direction === 'up' || direction === 'down'
        ? Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.back(1.7)),
            useNativeDriver: true,
          })
        : null,
    ].filter(Boolean)).start();
  };

  useEffect(() => {
    if (autoStart) {
      slideIn();
    }
  }, [autoStart]);

  return {
    translateX,
    translateY,
    slideIn,
    animatedStyle: {
      transform: [
        { translateX },
        { translateY },
      ],
    },
  };
};

// Fade animation hook
export const useFadeAnimation = (
  initialOpacity = 0,
  finalOpacity = 1,
  duration = 500,
  delay = 0,
  autoStart = true
) => {
  const opacity = useRef(new Animated.Value(initialOpacity)).current;

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: finalOpacity,
      duration,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: initialOpacity,
      duration,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (autoStart) {
      fadeIn();
    }
  }, [autoStart]);

  return {
    opacity,
    fadeIn,
    fadeOut,
    animatedStyle: {
      opacity,
    },
  };
};

// Stagger animation hook for lists
export const useStaggerAnimation = (
  itemCount,
  staggerDelay = 100,
  itemDuration = 300,
  autoStart = true
) => {
  const animatedValues = useRef(
    Array.from({ length: itemCount }, () => new Animated.Value(0))
  ).current;

  const startStagger = () => {
    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: itemDuration,
        delay: index * staggerDelay,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  };

  useEffect(() => {
    if (autoStart) {
      startStagger();
    }
  }, [autoStart, itemCount]);

  const getItemStyle = (index) => ({
    opacity: animatedValues[index],
    transform: [
      {
        translateY: animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
      {
        scale: animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  });

  return {
    animatedValues,
    startStagger,
    getItemStyle,
  };
};

// Morphing animation hook for shape changes
export const useMorphAnimation = (
  fromScale = { x: 1, y: 1 },
  toScale = { x: 1.5, y: 0.8 },
  duration = 800
) => {
  const scaleX = useRef(new Animated.Value(fromScale.x)).current;
  const scaleY = useRef(new Animated.Value(fromScale.y)).current;

  const startMorph = () => {
    Animated.parallel([
      Animated.timing(scaleX, {
        toValue: toScale.x,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleY, {
        toValue: toScale.y,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reverse animation
      Animated.parallel([
        Animated.timing(scaleX, {
          toValue: fromScale.x,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleY, {
          toValue: fromScale.y,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return {
    scaleX,
    scaleY,
    startMorph,
    animatedStyle: {
      transform: [
        { scaleX },
        { scaleY },
      ],
    },
  };
};

// Combined animation hook for complex animations
export const useComplexAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const animateSuccess = () => {
    Animated.sequence([
      // Scale up
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
      // Scale down
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateError = () => {
    Animated.sequence([
      // Wiggle left
      Animated.timing(translateX, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      // Wiggle right
      Animated.timing(translateX, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      // Wiggle left
      Animated.timing(translateX, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      // Return to center
      Animated.timing(translateX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateLoading = () => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const animatedStyle = {
    opacity,
    transform: [
      { scale },
      { translateX },
      { translateY },
      {
        rotate: rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return {
    scale,
    rotate,
    translateX,
    translateY,
    opacity,
    animateSuccess,
    animateError,
    animateLoading,
    animatedStyle,
  };
};

export default {
  usePressAnimation,
  useFloatingAnimation,
  usePulseAnimation,
  useWiggleAnimation,
  useBounceAnimation,
  useSlideInAnimation,
  useFadeAnimation,
  useStaggerAnimation,
  useMorphAnimation,
  useComplexAnimation,
};
