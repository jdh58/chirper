import { getDocs } from 'firebase/firestore';
import AccountModule from './components/AccountModule';
import uniqid from 'uniqid';

export default async function grabAccountsForInfinite(query) {
  try {
    const docs = await getDocs(query);
    console.log('fetched for grabAccountsForInfinite');

    console.log(query);
    const accountsArray = [];

    docs.docs.forEach((accountDoc) => {
      const accountData = accountDoc.data();

      accountsArray.push(
        <AccountModule
          chirpData={accountData}
          key={accountData.chirpId + uniqid()}
        />
      );
    });

    return {
      finalAccount: docs.docs[docs.docs.length - 1],
      newAccounts: accountsArray,
    };
  } catch (error) {
    console.error('Could not fetch accounts', error);
  }
}
