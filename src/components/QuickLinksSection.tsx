import { Users, Shield, FileCheck, BookOpen, Award, ExternalLink } from 'lucide-react';
import './QuickLinksSection.css';

const quickLinks = [
  {
    icon: <Users size={24} />,
    title: 'Profil LPM',
    description: 'Tentang lembaga penjaminan mutu',
    href: '/profil',
    color: 'var(--sky-600)',
  },
  {
    icon: <Shield size={24} />,
    title: 'Visi & Misi',
    description: 'Tujuan dan sasaran strategis',
    href: '/visi-dan-misi',
    color: 'var(--color-secondary-500)',
  },
  {
    icon: <FileCheck size={24} />,
    title: 'Akreditasi',
    description: 'Instrumen BAN-PT & LAM',
    href: '/spme/akreditasi-banpt',
    color: 'var(--color-gray-600)',
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Peraturan',
    description: 'Dasar hukum penjaminan mutu',
    href: '/peraturan',
    color: 'var(--sky-700)',
  },
  {
    icon: <Award size={24} />,
    title: 'Sertifikat',
    description: 'Akreditasi program studi',
    href: '/sertifikat',
    color: 'var(--color-secondary-600)',
  },
  {
    icon: <ExternalLink size={24} />,
    title: 'SIAMI',
    description: 'Sistem informasi akreditasi',
    href: 'http://siami.radenfatah.ac.id/',
    external: true,
    color: 'var(--color-gray-500)',
  },
];

export default function QuickLinksSection() {
  return (
    <section className="quicklinks-section">
      <div className="container">
        <div className="quicklinks-grid">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="quicklink-card"
            >
              <div
                className="quicklink-icon"
                style={{ backgroundColor: `${link.color}15`, color: link.color }}
              >
                {link.icon}
              </div>
              <div className="quicklink-content">
                <h3 className="quicklink-title">{link.title}</h3>
                <p className="quicklink-desc">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
