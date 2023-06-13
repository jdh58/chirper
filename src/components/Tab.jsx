export default function Tab({ currentTab, tabName, className, setTab }) {
  return (
    <button
      className={`${className} subheader`}
      onClick={setTab}
      style={
        currentTab === className
          ? { opacity: '1', fontWeight: 700 }
          : { opacity: '.7', fontWeight: 600 }
      }
    >
      <h2>{tabName}</h2>
    </button>
  );
}
