'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'

export default function SignUpPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: authData, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, role: 'guest' } },
    })

    if (signUpErr) { setError(signUpErr.message); setLoading(false); return }
    if (!authData.user) { setError('Registration failed. Please try again.'); setLoading(false); return }

    const { error: guestErr } = await supabase.from('guests').insert({
      profile_id: authData.user.id,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
    })

    if (guestErr) {
      setError(`Account created but guest profile setup failed: ${guestErr.message}`)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <>
        <SiteNav />
        <main className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-terra-light border border-terra flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-brown mb-3">Welcome to Cabalum Hotel</h2>
            <div className="w-10 h-px bg-terra mx-auto mb-5" />
            <p className="text-brown-mid text-sm leading-relaxed mb-8">
              Your guest account has been created. Download the Cabalum Hotel app to sign in,
              book rooms, manage your stay, and order from our restaurant.
            </p>
            <Link
              href="/"
              className="inline-block bg-terra text-white px-10 py-3.5 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors"
            >
              Return to the website
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SiteNav />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-terra mb-2">Guest Account</p>
            <h1 className="font-serif text-4xl text-brown mb-3">Create Account</h1>
            <div className="w-10 h-px bg-terra mx-auto mb-4" />
            <p className="text-sm text-brown-mid">Book rooms and access hotel services online.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', field: 'full_name', type: 'text',     placeholder: 'Juan Dela Cruz',   required: true  },
              { label: 'Email',     field: 'email',     type: 'email',    placeholder: 'you@email.com',    required: true  },
              { label: 'Phone',     field: 'phone',     type: 'tel',      placeholder: '+63 9XX XXX XXXX', required: false },
              { label: 'Password',  field: 'password',  type: 'password', placeholder: 'Min. 6 characters',required: true  },
              { label: 'Confirm Password', field: 'confirm', type: 'password', placeholder: 'Repeat your password', required: true },
            ].map(({ label, field, type, placeholder, required }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-brown-light uppercase tracking-widest mb-2">
                  {label}{required && ' *'}
                </label>
                <input
                  type={type}
                  required={required}
                  value={form[field as keyof typeof form]}
                  onChange={e => set(field, e.target.value)}
                  placeholder={placeholder}
                  minLength={field === 'password' || field === 'confirm' ? 6 : undefined}
                  className="w-full border border-warm-border rounded-lg px-4 py-3 text-sm bg-white text-brown placeholder-brown-light focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra"
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terra text-white py-3.5 rounded-lg font-medium hover:bg-terra-dark disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-brown-mid mt-6">
            Already have an account? Sign in from the Cabalum Hotel app.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
