import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import getAccount from '../getAccount';
import AccountModule from './AccountModule';
import RightBar from './RightBar';

export default function FollowPage() {
  const urlId = useParams().id;
  const accountType = useParams().type;
  const [profileDoc, setProfileDoc] = useState(null);
  const [accountModuleList, setAccountModuleList] = useState(null);

  console.log(urlId);
  console.log(accountType);

  useEffect(() => {
    (async () => {
      setProfileDoc(await getAccount(urlId));
    })();
  }, [urlId]);

  useEffect(() => {
    (async () => {
      let accountList;
      if (accountType === 'followers') {
        accountList = profileDoc.data().followers;
      } else {
        accountList = profileDoc.data().following;
      }

      const profileList = await Promise.all(
        accountList.map(async (followerId) => {
          return await getAccount(followerId);
        })
      );

      console.log(profileList);

      setAccountModuleList(
        profileList.map((profile) => {
          const profileData = profile.data();
          return <AccountModule profile={profileData} />;
        })
      );
    })();
  }, [profileDoc, accountType]);

  return (
    <>
      <div className="followPage page">{accountModuleList}</div>
      <RightBar />
    </>
  );
}
