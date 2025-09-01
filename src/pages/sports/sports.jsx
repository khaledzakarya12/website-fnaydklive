import NewsList from "../local/Newslist";
import NewsTicker from "../NewsTicker/NewsTicker";
function sportnews(){

return(
<div> 
    <NewsTicker />
       <NewsList category="sports" />
    </div>




)



}

export default sportnews;