import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Copyright 
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
              Nama Aplikasi
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Deskripsi singkat tentang aplikasi atau platform Anda.
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
                  href="/dashboard" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Harga
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dukungan
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
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700 text-center">
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
            <Copyright size={16} className="mr-2" />
            <span>{currentYear} Nama Aplikasi. Hak Cipta Dilindungi.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;