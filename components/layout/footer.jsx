import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Copyright,
  Github
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo dan Deskripsi */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Tomo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Platform media sosial untuk berbagi momen, terhubung dengan teman, dan menemukan inspirasi baru.
            </p>
          </div>

          {/* Tautan Halaman */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Halaman
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  href="/explore" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Jelajah
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Layanan
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/profile" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Profil Saya
                </Link>
              </li>
              <li>
                <Link 
                  href="/messages" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Pesan
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Bantuan
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Media Sosial */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Ikuti Kami
            </h4>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61550034904693" 
                target='_blank'
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://www.instagram.com/arifin0316/" 
                target='_blank'
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://github.com/Arifin0316" 
                target='_blank'
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Github size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700 text-center">
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
            <Copyright size={16} className="mr-2" />
            <span>{currentYear} Tomo. Hak Cipta Dilindungi.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;