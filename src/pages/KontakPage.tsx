import { useState } from 'react';
import Layout from '../components/Layout';
import { MapPin, Phone, Mail, Send, User, FileText, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { contactInfo } from '../data/navigation';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    identity: '',
    email: '',
    address: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
          <div className="container mx-auto">
            <nav className="text-sm text-sky-200 mb-3 flex items-center space-x-2">
              <a href="/" className="hover:text-white transition">Beranda</a>
              <span>/</span>
              <span className="text-white">Kontak</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold">Hubungi Kami</h1>
            <p className="text-sky-200 mt-2 font-medium">Lembaga Penjaminan Mutu UIN Raden Fatah Palembang</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white p-6">
                  <h3 className="font-extrabold text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-yellow-300" /> Alamat
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {contactInfo.address}
                  </p>
                  <p className="text-slate-500 text-sm mt-3 border-l-2 border-yellow-400 pl-3">
                    {contactInfo.building}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white p-6">
                  <h3 className="font-extrabold text-lg flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-yellow-300" /> Kontak
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
                      <Phone className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Telepon / WhatsApp</p>
                      <p className="text-slate-800 font-bold">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
                      <Mail className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Email</p>
                      <a href={`mailto:${contactInfo.email}`} className="text-sky-600 font-bold hover:text-yellow-600 transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
                      <Clock className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Jam Operasional</p>
                      <p className="text-slate-800 font-bold">Senin - Jumat: 08.00 - 16.00 WIB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-slate-200 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold">Peta Lokasi</p>
                  <p className="text-slate-400 text-sm">Jl. Pangeran Ratu, 5 Ulu, Jakabaring</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-sky-900 p-6">
                <h3 className="font-extrabold text-lg flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" /> Kirim Pesan
                </h3>
                <p className="text-sky-800 text-sm mt-1 font-medium">Isi formulir di bawah ini untuk mengirim pesan</p>
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-slate-800 mb-3">Pesan Terkirim!</h4>
                    <p className="text-slate-500 font-medium mb-6">Terima kasih telah menghubungi kami. Tim LPM akan segera merespons pesan Anda.</p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', identity: '', email: '', address: '', phone: '', message: '' }); }}
                      className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-all"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          <User className="w-4 h-4 inline mr-1" /> Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Masukkan nama lengkap"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          <FileText className="w-4 h-4 inline mr-1" /> No. Identitas
                        </label>
                        <input
                          type="text"
                          name="identity"
                          value={formData.identity}
                          onChange={handleChange}
                          placeholder="KTP / SIM / Paspor"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" /> Alamat Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@contoh.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Alamat</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Alamat lengkap"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" /> No. Telepon / HP
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-1" /> Isi Pesan
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" /> Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
