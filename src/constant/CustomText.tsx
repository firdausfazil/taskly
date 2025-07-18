import { View, Text as RNText } from 'react-native';
import React from 'react';

interface TextContent {
  content: string;
  className?: string; 
}

const CustomText: React.FC<TextContent> = ({ content, className }) => {
  return <RNText className={` ${className}`}>{content}</RNText>;
};

export default CustomText;
