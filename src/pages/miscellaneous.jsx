import NewsList from "./local/Newslist";
import NewsTicker from "./NewsTicker/NewsTicker";
function Miscellaneous(){

return(

<div>
       <NewsTicker />
       <NewsList category="miscellaneous" />
    </div>



)


}

export default Miscellaneous;