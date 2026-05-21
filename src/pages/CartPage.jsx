import { useMemo, useState } from "react";

const CART_KEY = "eventCart";
const WISHLIST_KEY = "eventWishlist";

function readStoredEvents(key) {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeStoredEvents(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("event-cart-updated"));
}

function EventList({ emptyText, items, onRemove, tag }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white/82 py-12 text-center text-sm text-[#6e6e73]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {items.map((event) => (
        <article key={event.id} className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_12px_34px_rgba(31,41,55,0.08)]">
          <div className="flex gap-3 p-3 sm:gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#eef2f7] sm:h-32 sm:w-36">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#eef6ff]" />
              )}
            </div>
            <div className="min-w-0 flex-1 py-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="truncate text-base font-semibold text-[#1d1d1f]">{event.title}</h2>
                <span className="shrink-0 rounded-full border border-[#cfe7ff] bg-[#eef6ff] px-2 py-1 text-[11px] text-[#1d4ed8]">{tag}</span>
              </div>
              <p className="mt-2 text-xs text-[#6e6e73]">
                {event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date pending"} - {event.city || "Venue pending"}
              </p>
              <p className="mt-1 text-xs text-[#6e6e73]">Price: Rs {event.priceAmount ?? 0}</p>
              <button
                onClick={() => onRemove(event.id)}
                className="mt-4 h-9 rounded-xl border border-black/10 px-3 text-xs font-medium text-[#5f5868] hover:bg-[#f8f4ff]"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function CartPage() {
  const [cartItems, setCartItems] = useState(() => readStoredEvents(CART_KEY));
  const [wishlistItems, setWishlistItems] = useState(() => readStoredEvents(WISHLIST_KEY));

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, event) => sum + Number(event.priceAmount || 0), 0),
    [cartItems],
  );

  function removeFromCart(id) {
    const nextItems = cartItems.filter((event) => event.id !== id);
    setCartItems(nextItems);
    writeStoredEvents(CART_KEY, nextItems);
  }

  function removeFromWishlist(id) {
    const nextItems = wishlistItems.filter((event) => event.id !== id);
    setWishlistItems(nextItems);
    writeStoredEvents(WISHLIST_KEY, nextItems);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[#1d1d1f]">
      <section className="rounded-3xl border border-white/70 bg-white/84 p-5 shadow-[0_18px_48px_rgba(31,41,55,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0071e3]">Cart</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#1d1d1f] md:text-4xl">Saved event picks</h1>
            <p className="mt-2 text-sm text-[#6e6e73]">Cart and wishlist are stored in this browser only.</p>
          </div>
          <div className="rounded-2xl border border-[#cfe7ff] bg-[#eef6ff] px-4 py-3">
            <p className="text-xs text-[#1d4ed8]">Cart Total</p>
            <p className="mt-1 text-xl font-semibold">Rs {totalAmount}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cart Items</h2>
          <span className="text-xs text-[#6e6e73]">{cartItems.length} saved</span>
        </div>
        <EventList items={cartItems} onRemove={removeFromCart} emptyText="Your cart is empty." tag="Cart" />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <span className="text-xs text-[#6e6e73]">{wishlistItems.length} saved</span>
        </div>
        <EventList items={wishlistItems} onRemove={removeFromWishlist} emptyText="Your wishlist is empty." tag="Wishlist" />
      </section>
    </div>
  );
}

export default CartPage;
