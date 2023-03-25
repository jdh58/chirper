import '../styles/TrendModule.css';

export default function TrendList() {
  return (
    <>
      <div className="trendItem">
        <p className="title">Trending #1</p>
        <h3 className="topic">76ers at Warriors</h3>
        <p className="number">7,324 Tweeps</p>
      </div>
      <div className="trendItem">
        <p className="title">Trending #2</p>
        <h3 className="topic">Mike Pence</h3>
        <p className="number">734K Tweeps</p>
      </div>
      <div className="trendItem">
        <p className="title">Trending #3</p>
        <h3 className="topic">#LakeShow</h3>
        <p className="number">243 Tweeps</p>
      </div>
      <div className="trendItem">
        <p className="title">Trending #4</p>
        <h3 className="topic">Fetterman</h3>
        <p className="number">72,043 Tweeps</p>
      </div>
    </>
  );
}
