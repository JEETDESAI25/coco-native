/**
 * Homescreen for Coco-Nutrition. Not seen too often but shown on first login
 * with version information for the technical folks.
 */

import React from 'react';
import TopBar from '../components/TopBar';
import Config from '../components/Config';
import {NavigatorContext} from '../contexts/Navigation';
import NWSafeAreaView from '../primitives/NWSafeAreaView';
import NWView from '../primitives/NWView';
import NWText from '../primitives/NWText';
import NWStatusBar from '../primitives/NWStatusBar';

export default function Home(): JSX.Element {
  const navigator = React.useContext(NavigatorContext);

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />
      <NWView className="flex-1 justify-center items-center px-4">
        <NWText className="text-3xl text-[#A62A72FF] mb-2">Welcome</NWText>
        <NWText className="text-3xl text-[#A62A72FF] mb-4">
          Version {Config.versionNumber}
        </NWText>
        <NWText className="text-xl text-[#C678A6] text-center">
          Find Nutritional Agency in your diet
        </NWText>
      </NWView>
    </NWSafeAreaView>
  );
}
