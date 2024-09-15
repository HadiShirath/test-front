import HomeUser from "./page/User/Home";
import Photo from "./page/User/Photo";
import Kecamatan from "./page/User/Kecamatan";
import Kelurahan from "./page/User/Kelurahan";
import Table from "./page/User/TableKecamatan";
import TableKelurahan from "./page/User/TableKelurahan";
import TableTPS from "./page/User/TableTPS";
import TPS from "./page/User/TPS";
import BerandaAdmin from "./page/Admin/Beranda"
import SaksiAdmin from "./page/Admin/Saksi"
import TPSAdmin from "./page/Admin/TPS"
import TableKecamatanAdmin from "./page/Admin/TableKecamatan"
import TableKelurahanAdmin from "./page/Admin/TableKelurahan"
import TableTPSAdmin from "./page/Admin/TableTPS"
import PhotoAdmin from "./page/Admin/Photo"
import Login from "./page/Login";
import Saksi from "./page/Saksi/Home";
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
          <Route
            exact
            path="/user/:kecamatan/:kelurahan/:tps/photo"
            element={<Photo />}
          />
          <Route exact path="/user/table" element={<Table />} />
          <Route exact path="/user/table/:kecamatan" element={<TableKelurahan />} />
          <Route
            exact
            path="/user/table/:kecamatan/:kelurahan"
            element={<TableTPS />}
          />
          <Route
            exact
            path="/:kecamatan/:kelurahan/:tps/photo"
            element={<Photo />}
          />
          <Route exact path="/table" element={<Table />} />
          <Route exact path="/table/:kecamatan" element={<TableKelurahan />} />
          <Route
            exact
            path="/table/:kecamatan/:kelurahan"
            element={<TableTPS />}
          />
          
          <Route exact path="/admin" element={<Login />} />
          <Route exact path="/admin/dashboard" element={<BerandaAdmin />} />
          <Route exact path="/admin/saksi" element={<SaksiAdmin />} />
          <Route exact path="/admin/tps" element={<TPSAdmin />} />
          <Route exact path="/admin/table" element={<TableKecamatanAdmin />} />
          <Route exact path="/admin/table/:kecamatan" element={<TableKelurahanAdmin />} />
          <Route exact path="/admin/table/:kecamatan/:kelurahan" element={<TableTPSAdmin />} />
          <Route exact path="/admin/:kecamatan/" element={<TableTPSAdmin />} />
          <Route exact path="/admin/:kecamatan/:kelurahan" element={<TableTPSAdmin />} />
          <Route exact path="/admin/:kecamatan/:kelurahan/:tps/photo" element={<PhotoAdmin />} />

          <Route exact path="/:kecamatan" element={<Kecamatan />} />
          <Route exact path="/:kecamatan/:kelurahan" element={<Kelurahan />} />
          <Route exact path="/:kecamatan/:kelurahan/:tps" element={<TPS />} />
          
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/saksi" element={<Saksi />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
