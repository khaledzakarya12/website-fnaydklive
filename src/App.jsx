import { useState, useEffect } from 'react';
import Navbar from './components/navbar/navbar';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Local from './pages/local/local';
import International from './pages/local/interntional/interntional';
import Home from './pages/local/Home/Home';
import { MainContext } from './utils/context';
import Autenction from './pages/Autenction/Autenction';
import Sportnews from './pages/sports/sports';
import Educationalnews from './pages/educatinal';
import NewsDetails from './pages/news/NewsDetails';
import Dashboard from './pages/Dachborad/Dachborad';
import Advertisement from './pages/advertisement/advertisement';
import SearchPage from './pages/search/search';
import Miscellaneous from './pages/miscellaneous';
import { auth, db } from "./utils/firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchUserData } from './utils/firebasefunction';
import Footer from "./components/footer/footer";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import Who from './pages/who';
import Contact from './pages/contact/contact';
import Privacy from './pages/privacy/privacy';
import Development from './pages/development/development';
import EditNews from './pages/Dachborad/editnews';
import NotifyUser from './components/Notifyuser/Notifyuser';
import BreakingPage from './pages/breaking/breaking';
import RedirectPage from './components/RedirectPage/RedirectPage';

function App() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (user) fetchUser();
    else setUserData(null);
  }, [user]);

  const fetchUser = async () => {
    const res = await fetchUserData(user);
    if (res.success) setUserData(res.data);
  };

  useEffect(() => {
    const recordSiteVisit = async () => {
      const visitedSites = JSON.parse(localStorage.getItem("visitedSites") || "[]");

      if (!visitedSites.includes("home")) {
        const docRef = doc(db, "visits", "siteStats");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) await updateDoc(docRef, { totalVisits: increment(1) });
        else await setDoc(docRef, { totalVisits: 1 });

        visitedSites.push("home");
        localStorage.setItem("visitedSites", JSON.stringify(visitedSites));
      }
    };

    const recordNewsVisit = async (newsId) => {
      const visitedNews = JSON.parse(localStorage.getItem("visitedNews") || "[]");

      if (!visitedNews.includes(newsId)) {
        const docRef = doc(db, "all-news", newsId); // كل خبر كمستند داخل all-news
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (docSnap.data().visits !== undefined) {
            await updateDoc(docRef, { visits: increment(1) });
          } else {
            await setDoc(docRef, { ...docSnap.data(), visits: 1 }, { merge: true });
          }
        } else {
          await setDoc(docRef, { visits: 1 });
        }

        visitedNews.push(newsId);
        localStorage.setItem("visitedNews", JSON.stringify(visitedNews));
      }
    };

    if (location.pathname === "/") recordSiteVisit();
    if (location.pathname.startsWith("/news/")) {
      const newsId = location.pathname.split("/news/")[1];
      recordNewsVisit(newsId);
    }
  }, [location]);

  return (

  <MainContext.Provider value={{ user, loading, userData }}>
      
       <NotifyUser/>
      
    <div className="layout">
     
      <Navbar />

      <main className="main-content">
        <Routes>
           <Route path="/:shortId" element={<RedirectPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<Local />} />
          <Route path="/international" element={<International />} />
          <Route path="/autenction" element={<Autenction />} />
          <Route path="/sports" element={<Sportnews />} />
          <Route path="/educatonal" element={<Educationalnews />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/who" element={<Who />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/development" element={<Development />} />
          <Route path="/edit-news/:id" element={<EditNews />} />
          <Route path="/breaking" element={<BreakingPage />} />
          <Route path="/miscellaneous" element={<Miscellaneous />} />
          <Route path="/advertisement" element={<Advertisement />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </MainContext.Provider>
);

}

export default App;
