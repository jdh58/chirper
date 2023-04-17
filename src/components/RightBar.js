import '../styles/RightBar.css';
import TrendItem from './TrendItem';
import Search from './Search';
import AccountModule from './AccountModule';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { app } from '../firebase-config';

export default function RightBar({ noSearch }) {
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    (async () => {
      const accountDocs = await getDocs(
        query(collection(getFirestore(app), 'accounts')),
        limit(3)
      );

      const accountList = accountDocs.docs.map((account) => (
        <AccountModule profile={account.data()} key={account.data().userId} />
      ));

      console.log(accountList);

      setAccounts(accountList);
    })();
  }, []);

  return (
    <aside className="rightBar">
      {!noSearch ? (
        <>
          <div className="searchContainer">
            <Search />
          </div>
          <div className="trends">
            <h2 className="title">What's happening</h2>
            <div className="whItems">
              <TrendItem />
              <TrendItem />
              <TrendItem />
              <TrendItem />
            </div>
          </div>
        </>
      ) : null}

      <div className={!noSearch ? 'accounts' : 'accounts only'}>
        <h2 className="title">Who to follow</h2>
        <div className="accountItems">{accounts}</div>
      </div>

      <div className="copyright">
        <a href="https://jonathanhawes.dev" target="_blank" rel="noreferrer">
          My Website
        </a>
        <a href="https://github.com/jdh58" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <div className="forcewrap"></div>
        <p>© 2023 Nobody, Inc.</p>
      </div>
    </aside>
  );
}
