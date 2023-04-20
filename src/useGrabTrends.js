import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import TrendItem from './components/TrendItem';
import { app } from './firebase-config';
import uniqid from 'uniqid';

export default function useGrabTrends(limitNum) {
  const [trendList, setTrendList] = useState([]);

  useEffect(() => {
    (async () => {
      const trendDocs = await getDocs(
        query(
          collection(getFirestore(app), 'hashtags'),
          orderBy('count', 'desc'),
          limit(limitNum)
        )
      );
      console.log('get trends for usegrabtrends');

      const trendArray = [];

      trendDocs.docs.forEach((trend, index) => {
        const trendData = trend.data();

        trendArray.push(
          <TrendItem
            number={index + 1}
            name={trendData.name}
            count={trendData.count}
            key={uniqid()}
          />
        );
      });

      setTrendList(trendArray);
    })();
  }, [limitNum]);

  return trendList;
}
