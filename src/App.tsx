import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProfilPage from './pages/ProfilPage';
import SambutanPage from './pages/SambutanPage';
import VisiMisiPage from './pages/VisiMisiPage';
import StrukturPage from './pages/StrukturPage';
import StafPage from './pages/StafPage';
import KontakPage from './pages/KontakPage';
import AkreditasiPage from './pages/AkreditasiPage';
import ISOPage from './pages/ISOPage';
import SitusPage from './pages/SitusPage';
import GPMPPage from './pages/GPMPPage';
import GPMFPage from './pages/GPMFPage';
import GaleriPage from './pages/GaleriPage';
import SertifikatPage from './pages/SertifikatPage';
import PeraturanPage from './pages/PeraturanPage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import BeritaList from './admin/pages/berita/List';
import BeritaCreate from './admin/pages/berita/create';
import BeritaEdit from './admin/pages/berita/edit/[id]';
import GaleriList from './admin/pages/galeri/List';
import GaleriCreate from './admin/pages/galeri/create';
import GaleriEdit from './admin/pages/galeri/Edit';
import KategoriGaleriIndex from './admin/pages/galeri/kategori/index';
import DownloadList from './admin/pages/download/List';
import DownloadCreate from './admin/pages/download/create';
import DownloadEdit from './admin/pages/download/Edit';
import StrukturOrg from './admin/pages/struktur/index';
import StafList from './admin/pages/staf/List';
import StafCreate from './admin/pages/staf/create';
import StafEdit from './admin/pages/staf/Edit';
import SertifikatList from './admin/pages/sertifikat/List';
import SertifikatCreate from './admin/pages/sertifikat/create';
import SertifikatEdit from './admin/pages/sertifikat/edit';
import PeraturanList from './admin/pages/peraturan/List';
import PeraturanCreate from './admin/pages/peraturan/create';
import PeraturanEdit from './admin/pages/peraturan/Edit';
import PollIndex from './admin/pages/poll/index';
import FooterIndex from './admin/pages/footer/index';
import HeroIndex from './admin/pages/hero/index';
import QuickAccessIndex from './admin/pages/quick-access/index';
import QuickAccessCreate from './admin/pages/quick-access/create';
import PartnerIndex from './admin/pages/partner/index';
import PartnerCreate from './admin/pages/partner/create';
import KategoriIndex from './admin/pages/kategori/index';
import TagIndex from './admin/pages/tag/index';
import FakerIndex from './admin/pages/faker/index';
import ProdiIndex from './admin/pages/prodi/index';
import UsersIndex from './admin/pages/users/index';
import RoleIndex from './admin/pages/role/index';
import PermissionIndex from './admin/pages/permission/index';
import LogIndex from './admin/pages/log/index';
import SpmeAkreditasiList from './admin/pages/spme/akreditasi/List';
import SpmeAkreditasiCreate from './admin/pages/spme/akreditasi/create';
import SpmeAkreditasiEdit from './admin/pages/spme/akreditasi/edit/[id]';
import SpmeIsoList from './admin/pages/spme/iso/List';
import SpmeIsoCreate from './admin/pages/spme/iso/create';
import SpmeIsoEdit from './admin/pages/spme/iso/edit/[id]';
import SpmeSitusList from './admin/pages/spme/situs/List';
import SpmeSitusCreate from './admin/pages/spme/situs/create';
import SpmeSitusEdit from './admin/pages/spme/situs/edit/[id]';
import ProfilLpm from './admin/pages/profil/lpm';
import ProfilSambutan from './admin/pages/profil/sambutan';
import ProfilVisiMisi from './admin/pages/profil/visimisi';
import ProfilStruktur from './admin/pages/profil/struktur';
import ProfilKontak from './admin/pages/profil/kontak';
import SpmiGpmp from './admin/pages/spmi/gpmp';
import SpmiGpmf from './admin/pages/spmi/gpmf';
import GeneralSettings from './admin/pages/settings/general';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteSettingsProvider>
        <Routes>
          {/* ========== PUBLIC FRONTEND ========== */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/profil" element={<Layout><ProfilPage /></Layout>} />
          <Route path="/sambutan-ketua" element={<Layout><SambutanPage /></Layout>} />
          <Route path="/visi-dan-misi" element={<Layout><VisiMisiPage /></Layout>} />
          <Route path="/struktur-organisasi" element={<Layout><StrukturPage /></Layout>} />
          <Route path="/pimpinan-dan-staf" element={<Layout><StafPage /></Layout>} />
          <Route path="/kontak" element={<Layout><KontakPage /></Layout>} />
          <Route path="/spme/akreditasi-banpt" element={<Layout><AkreditasiPage /></Layout>} />
          <Route path="/spme/iso" element={<Layout><ISOPage /></Layout>} />
          <Route path="/spme/situs-terkait" element={<Layout><SitusPage /></Layout>} />
          <Route path="/spmi/gpmp" element={<Layout><GPMPPage /></Layout>} />
          <Route path="/spmi/gpmf" element={<Layout><GPMFPage /></Layout>} />
          <Route path="/galeri-foto" element={<Layout><GaleriPage /></Layout>} />
          <Route path="/sertifikat" element={<Layout><SertifikatPage /></Layout>} />
          <Route path="/peraturan" element={<Layout><PeraturanPage /></Layout>} />
          <Route path="/berita" element={<Layout><BeritaPage /></Layout>} />
          <Route path="/berita/:slug" element={<Layout><BeritaDetailPage /></Layout>} />
          <Route path="/berita/:kategori" element={<Layout><BeritaPage /></Layout>} />

          {/* ========== ADMIN PANEL ========== */}
          <Route path="/login" element={<PublicAdminRoute><AdminLogin /></PublicAdminRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="berita" element={<BeritaList />} />
            <Route path="berita/create" element={<BeritaCreate />} />
            <Route path="berita/edit/:id" element={<BeritaEdit />} />
            <Route path="kategori" element={<KategoriIndex />} />
            <Route path="tag" element={<TagIndex />} />
            <Route path="galeri" element={<GaleriList />} />
            <Route path="galeri/create" element={<GaleriCreate />} />
            <Route path="galeri/edit/:id" element={<GaleriEdit />} />
            <Route path="galeri/kategori" element={<KategoriGaleriIndex />} />
            <Route path="download" element={<DownloadList />} />
            <Route path="download/create" element={<DownloadCreate />} />
            <Route path="download/edit/:id" element={<DownloadEdit />} />
            <Route path="struktur-organisasi" element={<StrukturOrg />} />
            <Route path="staf" element={<StafList />} />
            <Route path="staf/create" element={<StafCreate />} />
            <Route path="staf/edit/:id" element={<StafEdit />} />
            <Route path="sertifikat" element={<SertifikatList />} />
            <Route path="sertifikat/create" element={<SertifikatCreate />} />
            <Route path="sertifikat/:id/edit" element={<SertifikatEdit />} />
            <Route path="peraturan" element={<PeraturanList />} />
            <Route path="peraturan/create" element={<PeraturanCreate />} />
            <Route path="peraturan/edit/:id" element={<PeraturanEdit />} />
            <Route path="poll" element={<PollIndex />} />
            <Route path="footer" element={<FooterIndex />} />
            <Route path="hero" element={<HeroIndex />} />
            <Route path="quick-access" element={<QuickAccessIndex />} />
            <Route path="quick-access/create" element={<QuickAccessCreate />} />
            <Route path="partner" element={<PartnerIndex />} />
            <Route path="partner/create" element={<PartnerCreate />} />
            <Route path="faker" element={<FakerIndex />} />
            <Route path="prodi" element={<ProdiIndex />} />
            <Route path="users" element={<UsersIndex />} />
            <Route path="role" element={<RoleIndex />} />
            <Route path="permission" element={<PermissionIndex />} />
            <Route path="log" element={<LogIndex />} />
            <Route path="spme/akreditasi" element={<SpmeAkreditasiList />} />
            <Route path="spme/akreditasi/create" element={<SpmeAkreditasiCreate />} />
            <Route path="spme/akreditasi/edit/:id" element={<SpmeAkreditasiEdit />} />
            <Route path="spme/iso" element={<SpmeIsoList />} />
            <Route path="spme/iso/create" element={<SpmeIsoCreate />} />
            <Route path="spme/iso/edit/:id" element={<SpmeIsoEdit />} />
            <Route path="spme/situs" element={<SpmeSitusList />} />
            <Route path="spme/situs/create" element={<SpmeSitusCreate />} />
            <Route path="spme/situs/edit/:id" element={<SpmeSitusEdit />} />
            <Route path="profil/lpm" element={<ProfilLpm />} />
            <Route path="profil/sambutan" element={<ProfilSambutan />} />
            <Route path="profil/visimisi" element={<ProfilVisiMisi />} />
            <Route path="profil/struktur" element={<ProfilStruktur />} />
            <Route path="profil/kontak" element={<ProfilKontak />} />
            <Route path="spmi/gpmp" element={<SpmiGpmp />} />
            <Route path="spmi/gpmf" element={<SpmiGpmf />} />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>

          {/* ========== 404 ========== */}
          <Route path="*" element={
            <Layout>
              <div className="py-20 px-4 max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 min-h-[60vh] flex flex-col items-center justify-center text-center mt-8">
                <div className="w-24 h-24 bg-slate-100 border-4 border-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">?</span>
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-4">404</h2>
                <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed mb-10 font-medium">
                  Maaf, halaman yang Anda cari tidak tersedia.
                </p>
                <Link to="/" className="px-8 py-3.5 bg-sky-600 text-white rounded-full font-bold hover:bg-sky-700 transition-all">
                  Kembali ke Beranda
                </Link>
              </div>
            </Layout>
          } />
        </Routes>
      </SiteSettingsProvider>
    </BrowserRouter>
  );
}
