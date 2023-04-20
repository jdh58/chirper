import { useEffect } from 'react';
import useGrabTrends from '../useGrabTrends';
import TrendItem from './TrendItem';

export default function TrendingTab() {
  const trendList = useGrabTrends();

  console.log(trendList);

  return <>{trendList}</>;
}
