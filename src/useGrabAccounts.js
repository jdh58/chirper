import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from './firebase-config';
import AccountModule from './components/AccountModule';

export default function useGrabAccounts(limitNum) {
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    (async () => {
      const accountDocs = await getDocs(
        query(
          collection(getFirestore(app), 'accounts'),
          orderBy('followers', 'desc'),
          limit(limitNum)
        )
      );
      console.log('get accounts for usegrabaccounts');

      const accountArray = [];

      accountDocs.docs.forEach((account) => {
        const accountData = account.data();

        accountArray.push(
          <AccountModule profile={accountData} key={accountData.userId} />
        );
      });

      setAccountList(accountArray);
    })();
  }, [limitNum]);

  return accountList;
}
