import HomeUser from "./page/User/Home";
import Photo from "./page/User/Photo";
import Kecamatan from "./page/User/Kecamatan";
import Kelurahan from "./page/User/Kelurahan";
import Table from "./page/User/TableKecamatan";
import TableKelurahan from "./page/User/TableKelurahan";
import TableTPS from "./page/User/TableTPS";
import TPS from "./page/User/TPS";
import BerandaAdmin from "./page/Admin/Beranda"
import KecamatanAdmin from "./page/Admin/Kecamatan"
import KelurahanAdmin from "./page/Admin/Kelurahan"
import TPSAdmin from "./page/Admin/TPS"
import UserAdmin from "./page/Admin/User"
import TPSPageAdmin from "./page/Admin/TPSPage"
import TableKecamatanAdmin from "./page/Admin/TableKecamatan"
import TableKelurahanAdmin from "./page/Admin/TableKelurahan"
import TableTPSAdmin from "./page/Admin/TableTPS"
import PhotoAdmin from "./page/Admin/Photo"
import InboxAdmin from "./page/Admin/Inbox"
import OutboxAdmin from "./page/Admin/Outbox"
import ProfileAdmin from "./page/Admin/Profile"
import Login from "./page/Login";
import Saksi from "./page/Saksi/Home";
import Saksi2 from "./page/Saksi2/Home";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/user" element={<HomeUser />} />
          
          <Route exact path="/user/table" element={<Table />} />
          <Route exact path="/user/table/:kecamatan" element={<TableKelurahan />} />
          <Route
            exact
            path="/user/table/:kecamatan/:kelurahan"
            element={<TableTPS />}
          />

          <Route exact path="/user/:kecamatan" element={<Kecamatan />} />
          <Route exact path="/user/:kecamatan/:kelurahan" element={<Kelurahan />} />
          <Route exact path="/user/:kecamatan/:kelurahan/:tps" element={<TPS />} />
          <Route
            exact
            path="/user/:kecamatan/:kelurahan/:tps/photo"
            element={<Photo />}
          />
      

          
          <Route exact path="/admin" element={<Login />} />
          <Route exact path="/admin/dashboard" element={<BerandaAdmin />} />
          <Route exact path="/admin/dashboard/:kecamatan" element={<KecamatanAdmin />} />
          <Route exact path="/admin/dashboard/:kecamatan/:kelurahan" element={<KelurahanAdmin />} />
          <Route exact path="/admin/dashboard/:kecamatan/:kelurahan/:tps" element={<TPSAdmin />} />
          <Route exact path="/admin/dashboard/:kecamatan/:kelurahan/:tps/photo" element={<PhotoAdmin />} />
          <Route exact path="/admin/inbox" element={<InboxAdmin />} />
          <Route exact path="/admin/outbox" element={<OutboxAdmin />} />
          <Route exact path="/admin/profile" element={<ProfileAdmin />} />
          <Route exact path="/admin/user" element={<UserAdmin />} />
          <Route exact path="/admin/tps" element={<TPSPageAdmin />} />
          <Route exact path="/admin/table" element={<TableKecamatanAdmin />} />
          <Route exact path="/admin/table/:kecamatan" element={<TableKelurahanAdmin />} />
          <Route exact path="/admin/table/:kecamatan/:kelurahan" element={<TableTPSAdmin />} />

         
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/saksi" element={<Saksi />} />
          <Route exact path="/saksi/v2" element={<Saksi2 />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
