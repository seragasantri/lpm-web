import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home - standalone (has its own header/footer) */}
        <Route path="/" element={<Home />} />

        {/* Other pages - use Layout wrapper (Navbar + Footer) */}
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/sambutan-ketua" element={<SambutanPage />} />
        <Route path="/visi-dan-misi" element={<VisiMisiPage />} />
        <Route path="/struktur-organisasi" element={<StrukturPage />} />
        <Route path="/pimpinan-dan-staf" element={<StafPage />} />
        <Route path="/kontak" element={<KontakPage />} />

        {/* SPME */}
        <Route path="/spme/akreditasi-banpt" element={<AkreditasiPage />} />
        <Route path="/spme/iso" element={<ISOPage />} />
        <Route path="/spme/situs-terkait" element={<SitusPage />} />

        {/* SPMI */}
        <Route path="/spmi/gpmp" element={<GPMPPage />} />
        <Route path="/spmi/gpmf" element={<GPMFPage />} />

        {/* Galeri */}
        <Route path="/galeri-foto" element={<GaleriPage />} />

        {/* Sertifikat */}
        <Route path="/sertifikat" element={<SertifikatPage />} />

        {/* Peraturan */}
        <Route path="/peraturan" element={<PeraturanPage />} />

        {/* 404 */}
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
              <a href="/" className="px-8 py-3.5 bg-sky-600 text-white rounded-full font-bold hover:bg-sky-700 transition-all">
                Kembali ke Beranda
              </a>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}
