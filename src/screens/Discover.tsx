/**
 * Page for discovering diets and tips on how to better your nutrition
 */

import NWSafeAreaView from '../primitives/NWSafeAreaView';
import React from 'react';
import {ScrollView} from 'react-native';
import {NavigatorContext} from '../contexts/Navigation';
import TopBar from '../components/TopBar';
import Link from '../components/Link';
import NWView from '../primitives/NWView';
import NWText from '../primitives/NWText';
import NWStatusBar from '../primitives/NWStatusBar';

interface Headline {
  title: string;
  link: string;
}

const headlines: Array<Headline> = [
  {
    title: "Chipotle Is Expanding Faster Than You Can Say, 'Burrito'",
    link: 'https://www.forbes.com/sites/garystern/2024/02/09/chipotle-expanding-faster-than-you-can-say-burrito/?sh=73909b065aad',
  },
  {
    title: 'Best Diets Of 2024, According To Experts',
    link: 'https://www.forbes.com/health/nutrition/diet/best-diets/',
  },
  {
    title:
      'Salmonella, filth, undeclared drugs lead FDA to step up enforcement on imported food',
    link: 'https://www.foodsafetynews.com/2023/09/salmonella-filth-undeclared-drugs-lead-fda-to-step-up-enforcement-on-imported-food/',
  },
];

interface Diet {
  title: string;
}

const diets: Array<Diet> = [
  {
    title: 'Vegan',
  },
  {
    title: 'Vegetarian',
  },
  {
    title: 'Elimination',
  },
  {
    title: 'Heart Health',
  },
  {
    title: 'Detox',
  },
  {
    title: 'Pescatarian',
  },
];

export default function Discover(): JSX.Element {
  const navigator = React.useContext(NavigatorContext);

  return (
    <NWSafeAreaView className="flex-1">
      <NWStatusBar />
      <TopBar onButtonPress={() => navigator?.openDrawer()} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <NWView className="px-4">
          <NWText className="text-xl color-[#000000FF] pb-5">Headlines</NWText>
          {headlines.map(({title, link}, index) => (
            <NWView className="pb-5" key={index}>
              <NWView className="bg-[#C678A699] p-3">
                <Link className="" to={link}>
                  <NWText className="color-[#000000FF]">{title}</NWText>
                </Link>
              </NWView>
            </NWView>
          ))}

          <NWText className="text-xl color-[#000000FF] pt-10 pb-5">
            Diets
          </NWText>
          <NWView className="flex-row flex-wrap">
            {diets.map(({title}, index) => (
              <NWView className="pb-5 pr-2 w-1/2" key={index}>
                <NWView className="bg-[#C678A699] p-3">
                  <NWText className="color-[#000000FF]">{title}</NWText>
                </NWView>
              </NWView>
            ))}
          </NWView>
        </NWView>
      </ScrollView>
    </NWSafeAreaView>
  );
}
