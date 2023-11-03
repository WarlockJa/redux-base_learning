import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import IFrames from "../Widgets/IFrames";

const Layout = () => {
  return (
    <div className="App">
      <Header />
      {/* placing iFrames on every route to prevent their reload */}
      <IFrames />
      <Outlet />
    </div>
  );
};

export default Layout;
