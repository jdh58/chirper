export default function FollowButton({ isProfile }) {
  return (
    <div className={isProfile ? 'followButton profileButton' : 'followButton'}>
      Follow
    </div>
  );
}
