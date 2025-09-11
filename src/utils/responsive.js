import { Dimensions } from 'react-native';

/**
 * Utility functions for responsive design
 */

const { width, height } = Dimensions.get('window');

// Base dimensions (design was created for)
const baseWidth = 375;
const baseHeight = 812;

/**
 * Scales a value based on the screen width
 * @param {number} size - The size to scale
 * @returns {number} - The scaled size
 */
export const scaleWidth = (size) => (width / baseWidth) * size;

/**
 * Scales a value based on the screen height
 * @param {number} size - The size to scale
 * @returns {number} - The scaled size
 */
export const scaleHeight = (size) => (height / baseHeight) * size;

/**
 * Returns a responsive value based on the device size
 * @param {Object} options - The responsive options
 * @param {number|string} options.small - Value for small screens
 * @param {number|string} options.medium - Value for medium screens
 * @param {number|string} options.large - Value for large screens
 * @returns {number|string} - The responsive value
 */
export const getResponsiveValue = (options) => {
  const { small, medium, large } = options;
  
  if (width < 375) {
    return small;
  } else if (width < 768) {
    return medium || small;
  } else {
    return large || medium || small;
  }
};

/**
 * Returns a font size based on the device size
 * @param {number} size - The base font size
 * @returns {number} - The responsive font size
 */
export const responsiveFontSize = (size) => {
  const scale = Math.min(width / baseWidth, height / baseHeight);
  const newSize = size * scale;
  return Math.round(newSize);
};

/**
 * Returns a value indicating if the device is in landscape mode
 * @returns {boolean} - True if in landscape mode
 */
export const isLandscape = () => width > height;

/**
 * Returns a value indicating if the device is a tablet
 * @returns {boolean} - True if the device is a tablet
 */
export const isTablet = () => {
  const aspectRatio = height / width;
  return aspectRatio <= 1.6 && width >= 600;
};