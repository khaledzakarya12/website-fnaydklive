import NewsTicker from "../pages/NewsTicker/NewsTicker";
function Layout(){
  return (
    <div>
     
      <NewsTicker />

    
      <main>{children}</main>
    </div>
  );



}

export default Layout;