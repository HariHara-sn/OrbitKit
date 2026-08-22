import React from 'react';
import { useTorchContext } from '../providers/AppProviders';
import { FlashlightScreen } from '../../features/flashlight/screens/FlashlightScreen';
import { WhiteScreen } from '../../features/flashlight/screens/WhiteScreen';

export const AppNavigator = () => {
  const { isWhiteScreenVisible } = useTorchContext();
  return isWhiteScreenVisible ? <WhiteScreen /> : <FlashlightScreen />;
};
