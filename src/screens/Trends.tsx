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
import {ScrollView, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface TrendStat {
  title: string;
  value: number;
  icon?: string;
}

function getTotals(
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
): Array<TrendStat> {
  return [
    {title: 'Total Calories', value: calories, icon: 'local-fire-department'},
    {title: 'Fat', value: fat, icon: 'opacity'},
    {title: 'Carbs', value: carbs, icon: 'grain'},
    {title: 'Protein', value: protein, icon: 'fitness-center'},
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
      {totals.map(({title, value, icon}, index) => {
        return (
          <NWView
            key={index}
            className="mb-3 rounded-xl overflow-hidden shadow-lg"
            style={styles.cardShadow}>
            <NWView className="flex-row items-center bg-[#A62A72] p-4">
              {icon && (
                <MaterialIcon
                  name={icon}
                  size={24}
                  color="#FFFFFF"
                  style={styles.icon}
                />
              )}
              <NWView className="flex-1">
                <NWText className="text-white text-lg font-medium">
                  {title}
                </NWText>
                <NWText className="text-white text-2xl font-bold">
                  {value}
                  <NWText className="text-white text-sm ml-1">
                    {title === 'Total Calories' ? 'kcal' : 'g'}
                  </NWText>
                </NWText>
              </NWView>
            </NWView>
          </NWView>
        );
      })}
    </NWView>
  );
}

function TrendsPieChart(): JSX.Element {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];

  const pieData = data
    .filter(value => value > 0)
    .map((value, index) => ({
      value,
      svg: {
        fill: index % 2 === 0 ? '#A62A72' : '#C678A6',
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
    }));

  return (
    <NWView className="bg-white p-4 mb-6">
      <PieChart
        style={{height: 250}}
        data={pieData}
        innerRadius="60%"
        padAngle={0.02}
      />
    </NWView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 16,
  },
  todayBar: {
    backgroundColor: '#E9D3E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F8E7EF',
  },
  macroTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#A62A72',
    marginBottom: 24,
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#A62A72',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statUnit: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 4,
  },
});

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

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{flex: 1}}>
        <NWView style={{backgroundColor: '#F8F9FA'}}>
          <NWView style={{height: 60}}>
            <SincePicker
              currentSinceOption={sinceOption}
              updateSinceOption={updateSinceOption}
            />
          </NWView>
          <NWView className="px-4">
            <NWText style={styles.macroTitle}>Macronutrients</NWText>
            <TrendsPieChart />
            {macrosTotals.map(({title, value, icon}, index) => (
              <NWView key={index} style={styles.statCard}>
                <NWView className="flex-row items-center">
                  {icon && (
                    <MaterialIcon
                      name={icon}
                      size={28}
                      color="#FFFFFF"
                      style={styles.icon}
                    />
                  )}
                  <NWView>
                    <NWText style={styles.statTitle}>{title}</NWText>
                    <NWView className="flex-row items-baseline">
                      <NWText style={styles.statValue}>{value}</NWText>
                      <NWText style={styles.statUnit}>
                        {title === 'Total Calories' ? 'kcal' : 'g'}
                      </NWText>
                    </NWView>
                  </NWView>
                </NWView>
              </NWView>
            ))}

            <NWText style={[styles.macroTitle, {marginTop: 24}]}>Habits</NWText>
            {habits.map((habit, index) => (
              <NWView
                key={index}
                style={[
                  styles.statCard,
                  {marginBottom: index === habits.length - 1 ? 24 : 12},
                ]}>
                <NWView className="flex-row items-center">
                  <MaterialIcon
                    name="check-circle"
                    size={28}
                    color="#FFFFFF"
                    style={styles.icon}
                  />
                  <NWText style={styles.statTitle}>{habit}</NWText>
                </NWView>
              </NWView>
            ))}
          </NWView>
        </NWView>
      </ScrollView>
    </NWSafeAreaView>
  );
}
