/**
 * Trends for aggregate data surrounding reported foods.
 */

import React from 'react';
import {PieChart} from 'react-native-svg-charts';
import {NavigatorContext} from '../contexts/Navigation';
import TopBar from '../components/TopBar';
import SincePicker, {SinceOption} from '../components/SincePicker';
import NWView from '../primitives/NWView';
import NWText from '../primitives/NWText';
import NWSafeAreaView from '../primitives/NWSafeAreaView';
import NWStatusBar from '../primitives/NWStatusBar';
import {ScrollView} from 'react-native';

interface TrendStat {
  title: string;
  value: number;
}

function getTotals(
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
): Array<TrendStat> {
  return [
    {title: 'Total', value: calories},
    {title: 'Fat', value: fat},
    {title: 'Carbs', value: carbs},
    {title: 'Protein', value: protein},
  ];
}

const habits = ['Drink Water', 'Be Happy'];

function TrendTotals({
  totals,
  className,
}: {
  totals: Array<TrendStat>;
  className?: string;
}): JSX.Element {
  return (
    <NWView className={className || ''}>
      {totals.map(({title, value}, index) => {
        return (
          <NWView className=" pb-2 " key={index}>
            <NWView className=" flex-0 flex-row justify-between bg-[#A62A72BB] p-2 ">
              <NWText className=" color-[#000000FF] "> {title} </NWText>
              <NWText className=" text-l ">{value}</NWText>
            </NWView>
          </NWView>
        );
      })}
    </NWView>
  );
}

function TrendsPieChart(): JSX.Element {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];

  const randomColor = () =>
    ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
      0,
      7,
    );

  const pieData = data
    .filter(value => value > 0)
    .map((value, index) => ({
      value,
      svg: {
        fill: randomColor(),
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
    }));

  return <PieChart style={{height: 200}} data={pieData} />;
}

export default function Trends(): JSX.Element {
  const navigator = React.useContext(NavigatorContext);
  const [sinceOption, updateSinceOption] = React.useState(SinceOption.Today);

  const totalCalories = 100;
  const totalFat = 20;
  const totalCarbs = 30;
  const totalProtein = 50;

  const macrosTotals = getTotals(
    totalCalories,
    totalFat,
    totalCarbs,
    totalProtein,
  );
  const dailyTotals = getTotals(
    totalCalories,
    totalFat,
    totalCarbs,
    totalProtein,
  );

  const randomColor = () =>
    ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
      0,
      7,
    );

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <NWView className="px-4">
          <SincePicker
            currentSinceOption={sinceOption}
            updateSinceOption={updateSinceOption}
          />
          <NWText className="text-xl color-[#000000FF] pb-5">
            Macronutrients
          </NWText>
          <TrendsPieChart />
          <TrendTotals totals={macrosTotals} className="mt-4" />
          <NWText className="text-xl color-[#000000FF] pt-10 pb-5">
            Daily Totals
          </NWText>
          <TrendTotals totals={dailyTotals} className="mb-4" />
          <NWText className="text-xl color-[#000000FF] pt-10 pb-5">
            Habits
          </NWText>
          <NWView>
            {habits.map((habit, index) => (
              <NWText
                className="mb-2 p-1 bg-[#A62A72BB] text-m color-[#000000FF]"
                key={index}>
                {habit}
              </NWText>
            ))}
          </NWView>
        </NWView>
      </ScrollView>
    </NWSafeAreaView>
  );
}
