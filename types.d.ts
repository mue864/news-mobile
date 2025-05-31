// Type declarations for modules without TypeScript definitions

declare module 'expo-linear-gradient' {
  import { ComponentClass } from 'react';
  import { ViewProps } from 'react-native';

  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
  }

  const LinearGradient: ComponentClass<LinearGradientProps>;
  export { LinearGradient };
  export default LinearGradient;
}
