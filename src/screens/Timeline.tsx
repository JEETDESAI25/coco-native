/**
 * Timeline for past nutrients and foods chosen before.
 */

import NWSafeAreaView from '../primitives/NWSafeAreaView';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {NavigatorContext} from '../contexts/Navigation';
import TopBar from '../components/TopBar';
import SincePicker, {SinceOption} from '../components/SincePicker';
import NWView from '../primitives/NWView';
import NWText from '../primitives/NWText';
import NWStatusBar from '../primitives/NWStatusBar';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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
    calories: 450,
    mealType: 'Breakfast',
    mealTime: new Date(new Date().setHours(8, 30)),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 2,
    calories: 120,
    mealType: 'Morning Snack',
    mealTime: new Date(new Date().setHours(10, 15)),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 3,
    calories: 650,
    mealType: 'Lunch',
    mealTime: new Date(new Date().setHours(12, 45)),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 4,
    calories: 200,
    mealType: 'Afternoon Snack',
    mealTime: new Date(new Date().setHours(15, 30)),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  {
    id: 5,
    calories: 750,
    mealType: 'Dinner',
    mealTime: new Date(new Date().setHours(19, 0)),
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  },
  // {
  //   id: 6,
  //   calories: 100,
  //   mealType: 'Lunch',
  //   mealTime: new Date(),
  //   image:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  // },
  // {
  //   id: 7,
  //   calories: 100,
  //   mealType: 'Lunch',
  //   mealTime: new Date(),
  //   image:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  // },
  // {
  //   id: 8,
  //   calories: 100,
  //   mealType: 'Lunch',
  //   mealTime: new Date(),
  //   image:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  // },
  // {
  //   id: 9,
  //   calories: 100,
  //   mealType: 'Lunch',
  //   mealTime: new Date(),
  //   image:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  // },
  // {
  //   id: 10,
  //   calories: 100,
  //   mealType: 'Lunch',
  //   mealTime: new Date(),
  //   image:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  // },
  // {
  //   id: 11,
  //   calories: 100,
  //   mealType: 'Lunch',
  //   mealTime: new Date(),
  //   image:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  // },
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
  const [sinceOption, updateSinceOption] = React.useState<SinceOption>(
    SinceOption.Today,
  );

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />
      <NWView className="flex-1" style={{backgroundColor: '#F8F9FA'}}>
        <NWView style={{height: 60}}>
          <SincePicker
            currentSinceOption={sinceOption}
            updateSinceOption={updateSinceOption}
          />
        </NWView>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          inverted={true}
          data={meals}
          keyExtractor={item => String(item.id)}
          renderItem={({item}: {item: TimelineMeal}) => (
            <NWView
              className="flex-row bg-[#A62A72] rounded-2xl mb-3"
              style={styles.timelineCard}>
              <NWView style={styles.iconContainer}>
                <MaterialIcon
                  name="restaurant"
                  size={28}
                  color="#FFFFFF"
                  style={styles.mealIcon}
                />
              </NWView>
              <NWView className="flex-1 py-4 px-3">
                <NWText
                  style={{color: '#FFFFFF'}}
                  className="text-xl font-normal">
                  {item.mealType}
                </NWText>
                <NWText style={{color: '#FFFFFF'}} className="text-lg mt-1">
                  {item.calories} kcal
                </NWText>
              </NWView>
              <NWView className="justify-center pr-4">
                <NWText style={{color: '#FFFFFF'}} className="text-base">
                  {new Date(item.mealTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </NWText>
              </NWView>
            </NWView>
          )}
        />
      </NWView>
    </NWSafeAreaView>
  );
}

const styles = StyleSheet.create({
  timelineCard: {
    minHeight: 90,
    backgroundColor: '#A62A72',
  },
  iconContainer: {
    width: 50,
    height: 50,
    marginLeft: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C678A6',
    borderRadius: 25,
  },
  mealIcon: {
    opacity: 0.9,
  },
});
