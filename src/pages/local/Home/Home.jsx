import NewsList from "../Newslist";
import NewsTicker from "../../NewsTicker/NewsTicker";
 function HomePage() {
  return (
    <div className="home">
      <NewsTicker/>
      <NewsList/>
    </div>
  );
}

export default HomePage