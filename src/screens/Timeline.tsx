/**
 * Timeline for past nutrients and foods chosen before.
 */

import NWSafeAreaView from '../primitives/NWSafeAreaView';
import React from 'react';
import {FlatList} from 'react-native';
import {NavigatorContext} from '../contexts/Navigation';
import TopBar from '../components/TopBar';
import SincePicker, {SinceOption} from '../components/SincePicker';
import NWView from '../primitives/NWView';
import NWImage from '../primitives/NWImage';
import NWText from '../primitives/NWText';
import NWStatusBar from '../primitives/NWStatusBar';

interface TimelineMeal {
  id: number;
  calories: number;
  mealType: string;
  mealTime: Date;
  image: string;
}

const meals: TimelineMeal[] = [
  {
    id: 1,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 2,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 3,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 4,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 5,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 6,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 7,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 8,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 9,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 10,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 11,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 12,
    calories: 100,
    mealType: 'Lunch',
    mealTime: new Date(),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
];

export default function Timeline(): JSX.Element {
  const navigator = React.useContext(NavigatorContext);
  const [sinceOption, updateSinceOption] = React.useState(SinceOption.Today);

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />
      <NWView className="flex-1 px-1">
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
          }}
          inverted={true}
          data={meals}
          keyExtractor={item => String(item.id)}
          renderItem={({item}: {item: TimelineMeal}) => (
            <NWView className="flex-row justify-between bg-[#A62A72BB] mt-4 ml-8 py-2">
              <NWImage className="ml-4" width={50} source={{uri: item.image}} />
              <NWView className="ml-4 flex-1 flex-col py-2">
                <NWText>{item.mealType}</NWText>
                <NWText>{item.calories + ' Calories'}</NWText>
              </NWView>
              <NWView className="flex-1 flex-col py-2">
                <NWText>{item.mealTime.toUTCString()}</NWText>
              </NWView>
            </NWView>
          )}
        />
        <SincePicker
          currentSinceOption={sinceOption}
          updateSinceOption={updateSinceOption}
        />
      </NWView>
    </NWSafeAreaView>
  );
}
