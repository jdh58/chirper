export default function Tab({ currentTab, tabName, className, setTab }) {
  return (
    <div
      className={`${className} subheader`}
      onClick={setTab}
      style={
        currentTab === className
          ? { opacity: '1', fontWeight: 700 }
          : { opacity: '70%', fontWeight: 600 }
      }
    >
      <h2>{tabName}</h2>
    </div>
  );
}
