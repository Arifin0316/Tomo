'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      username: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error)
      setLoading(false)
      return
    }

    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Buat Akun Admin
            </h2>
            <p className="text-gray-600 mb-8">
              Daftar untuk mengakses dashboard
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Masukkan nama Anda"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Masukkan email Anda"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Buat password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Daftar'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
              >
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}