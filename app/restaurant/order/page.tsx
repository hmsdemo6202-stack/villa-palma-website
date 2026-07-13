'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'

interface PosCategory { id: string; name: string; sort_order: number }
interface PosItem {
  id: string; name: string; description: string | null
  price: number; category_id: string | null; image_url: string | null
}
interface CartLine { item: PosItem; qty: number }

function peso(n: number) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

type OrderStatus = 'cart' | 'confirming' | 'success' | 'error'

export default function RestaurantOrderPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [authLoading, setAuthLoading] = useState(true)
  const [guestId,     setGuestId]     = useState<string | null>(null)
  const [userName,    setUserName]    = useState('')

  const [categories, setCategories] = useState<PosCategory[]>([])
  const [items,      setItems]      = useState<PosItem[]>([])
  const [activeCat,  setActiveCat]  = useState<string>('all')
  const [cart,       setCart]       = useState<CartLine[]>([])
  const [notes,      setNotes]      = useState('')
  const [status,     setStatus]     = useState<OrderStatus>('cart')
  const [orderId,    setOrderId]    = useState<string | null>(null)
  const [loading,    setLoading]    = useState(true)

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/restaurant/order')
        return
      }
      setUserName(user.email ?? '')

      // Fetch linked guest profile
      const { data: guest } = await supabase
        .from('guests')
        .select('id, full_name')
        .eq('profile_id', user.id)
        .maybeSingle()
      if (guest) {
        setGuestId(guest.id)
        setUserName(guest.full_name ?? user.email ?? '')
      }
      setAuthLoading(false)
    }
    checkAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMenu = useCallback(async () => {
    const [{ data: cats }, { data: its }] = await Promise.all([
      supabase.from('pos_categories').select('id, name, sort_order').order('sort_order').order('name'),
      supabase.from('pos_items').select('id, name, description, price, category_id, image_url').eq('is_available', true).order('name'),
    ])
    setCategories((cats as PosCategory[]) ?? [])
    setItems((its as PosItem[]) ?? [])
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!authLoading) loadMenu()
  }, [authLoading, loadMenu])

  // Cart helpers
  function addToCart(item: PosItem) {
    setCart(prev => {
      const idx = prev.findIndex(l => l.item.id === item.id)
      if (idx >= 0) return prev.map((l, i) => i === idx ? { ...l, qty: l.qty + 1 } : l)
      return [...prev, { item, qty: 1 }]
    })
  }

  function setQty(itemId: string, qty: number) {
    if (qty <= 0) { setCart(prev => prev.filter(l => l.item.id !== itemId)); return }
    setCart(prev => prev.map(l => l.item.id === itemId ? { ...l, qty } : l))
  }

  const subtotal = cart.reduce((s, l) => s + l.item.price * l.qty, 0)

  async function placeOrder() {
    if (cart.length === 0) return
    if (!guestId) {
      setStatus('error'); return
    }
    setStatus('confirming')

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        guest_id:     guestId,
        status:       'pending',
        total_amount: subtotal,
        notes:        notes.trim() || null,
      })
      .select('id')
      .single()

    if (orderErr || !order) {
      setStatus('error'); return
    }

    const { error: itemsErr } = await supabase.from('order_items').insert(
      cart.map(l => ({
        order_id:    order.id,
        pos_item_id: l.item.id,
        name:        l.item.name,
        quantity:    l.qty,
        unit_price:  l.item.price,
      }))
    )

    if (itemsErr) { setStatus('error'); return }
    setOrderId(order.id)
    setStatus('success')
    setCart([])
    setNotes('')
  }

  const visible = items.filter(i => activeCat === 'all' || i.category_id === activeCat)

  const itemsByCategory: Record<string, string> = {}
  categories.forEach(c => { itemsByCategory[c.id] = c.name })

  if (authLoading) {
    return (
      <>
        <SiteNav />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-brown-light text-sm">Checking sign-in…</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SiteNav />

      <div className="min-h-screen bg-[#f9f5f0]">
        {/* Header */}
        <div className="bg-[#2d1c14] py-10 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-2">Restaurant</p>
          <h1 className="font-serif text-4xl text-[#f0e0d0]">Order Food</h1>
          {userName && <p className="text-[#9d8075] text-xs mt-2">Ordering as {userName}</p>}
        </div>

        {/* Success */}
        {status === 'success' && (
          <div className="max-w-xl mx-auto mt-10 px-6">
            <div className="bg-white border border-green-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">🍽️</div>
              <h2 className="font-serif text-2xl text-brown mb-2">Order Placed!</h2>
              <p className="text-sm text-brown-light mb-2">
                Your order has been sent to the kitchen. Order ref: <span className="font-mono text-xs text-brown">{orderId?.slice(-8).toUpperCase()}</span>
              </p>
              <p className="text-xs text-brown-light mb-6">
                If you're a hotel guest, your order will be brought to your room. Otherwise, please come to the restaurant to collect.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStatus('cart')}
                  className="border border-terra text-terra px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#fdf0eb] transition-colors"
                >
                  Order More
                </button>
                <Link href="/" className="bg-terra text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="max-w-xl mx-auto mt-10 px-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              {!guestId ? (
                <>
                  <p className="text-red-700 font-medium mb-2">Guest profile not found.</p>
                  <p className="text-red-600 text-sm mb-4">
                    Your account isn&apos;t linked to a guest profile yet. Please contact the front desk or{' '}
                    <Link href="/signup" className="underline">complete your registration</Link>.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-red-700 font-medium mb-2">Could not place order.</p>
                  <p className="text-red-600 text-sm mb-4">Please try again or contact the front desk.</p>
                </>
              )}
              <button onClick={() => setStatus('cart')} className="bg-terra text-white px-5 py-2 rounded-lg text-sm">Go Back</button>
            </div>
          </div>
        )}

        {/* Cart + menu */}
        {(status === 'cart' || status === 'confirming') && (
          <div className="max-w-5xl mx-auto px-6 py-10 flex gap-8 items-start flex-col lg:flex-row">

            {/* Menu */}
            <div className="flex-1 min-w-0">
              {/* Category tabs */}
              <div className="flex gap-2 flex-wrap mb-6">
                <button
                  onClick={() => setActiveCat('all')}
                  className={`text-xs px-4 py-1.5 rounded-full font-medium border transition-colors ${
                    activeCat === 'all'
                      ? 'bg-terra text-white border-terra'
                      : 'border-warm-border text-brown-light hover:bg-white'
                  }`}
                >
                  All
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id)}
                    className={`text-xs px-4 py-1.5 rounded-full font-medium border transition-colors ${
                      activeCat === c.id
                        ? 'bg-terra text-white border-terra'
                        : 'border-warm-border text-brown-light hover:bg-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {loading ? (
                <p className="text-brown-light text-sm text-center py-16">Loading menu…</p>
              ) : visible.length === 0 ? (
                <p className="text-brown-light text-sm text-center py-16">No items available in this category.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visible.map(item => {
                    const inCart = cart.find(l => l.item.id === item.id)
                    return (
                      <div
                        key={item.id}
                        className={`bg-white border-2 rounded-xl p-4 transition-all ${
                          inCart ? 'border-terra' : 'border-warm-border'
                        }`}
                      >
                        <div className="flex gap-3">
                          {item.image_url && (
                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-2 items-start">
                              <h3 className="font-medium text-brown text-sm leading-snug">{item.name}</h3>
                              <span className="font-semibold text-brown text-sm shrink-0">{peso(item.price)}</span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-brown-light mt-1 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Qty controls */}
                        <div className="flex justify-end items-center gap-2 mt-3">
                          {inCart ? (
                            <>
                              <button
                                onClick={() => setQty(item.id, inCart.qty - 1)}
                                className="w-7 h-7 rounded-full border-2 border-terra text-terra text-sm font-bold flex items-center justify-center hover:bg-[#fdf0eb] transition-colors"
                              >
                                −
                              </button>
                              <span className="font-semibold text-brown text-sm w-5 text-center">{inCart.qty}</span>
                              <button
                                onClick={() => setQty(item.id, inCart.qty + 1)}
                                className="w-7 h-7 rounded-full bg-terra text-white text-sm font-bold flex items-center justify-center hover:bg-terra-dark transition-colors"
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="text-xs bg-terra text-white px-4 py-1.5 rounded-full font-medium hover:bg-terra-dark transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 sticky top-24">
              <div className="bg-white border border-warm-border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-warm-border">
                  <h2 className="font-semibold text-brown">Your Order</h2>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="text-xs text-red-400 hover:underline mt-0.5">Clear</button>
                  )}
                </div>

                <div className="px-5 py-4 space-y-3 min-h-[120px]">
                  {cart.length === 0 ? (
                    <p className="text-xs text-brown-light text-center py-6">Add items from the menu.</p>
                  ) : (
                    cart.map(line => (
                      <div key={line.item.id} className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-brown font-medium truncate">{line.item.name}</p>
                          <p className="text-xs text-brown-light">{line.qty} × {peso(line.item.price)}</p>
                        </div>
                        <span className="text-sm font-semibold text-brown shrink-0">{peso(line.item.price * line.qty)}</span>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="px-5 pb-5 space-y-3 border-t border-warm-border pt-4">
                    <div className="flex justify-between font-bold text-brown">
                      <span>Total</span>
                      <span className="text-terra">{peso(subtotal)}</span>
                    </div>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Special requests (optional)…"
                      rows={2}
                      className="w-full border border-warm-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-terra"
                    />
                    <button
                      onClick={placeOrder}
                      disabled={status === 'confirming'}
                      className="w-full bg-terra text-white py-3 rounded-xl font-semibold text-sm hover:bg-terra-dark disabled:opacity-50 transition-colors"
                    >
                      {status === 'confirming' ? 'Placing Order…' : 'Place Order'}
                    </button>
                    <p className="text-[10px] text-brown-light text-center">
                      Payment settled at the restaurant or added to your room bill.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
