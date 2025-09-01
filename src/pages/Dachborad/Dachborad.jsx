import Sidebar from "./Sidebar";
import Header from "./Header";
import NewsForm from "./NewForm";
import NewsTable from "./NewsTable";
import NewsList from "../local/Newslist";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* الشريط الجانبي */}
      <Sidebar />

      {/* المحتوى الرئيسي */}
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <NewsForm />
          <NewsTable />
          <NewsList />
        </div>
      </div>
    </div>
  );
}
