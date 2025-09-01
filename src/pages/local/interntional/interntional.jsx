import NewsTicker from "../../NewsTicker/NewsTicker";
import NewsList from "../Newslist";


function internationalnews() {
  return (
    <div className="inter">
      <NewsTicker />
      <NewsList category="international" />
    </div>
  );
}

export default internationalnews