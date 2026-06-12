import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "lm_couture_products";
const CART_KEY = "lm_couture_cart";
const ORDERS_KEY = "lm_couture_orders";

function load(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
}
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const defaultProducts = [
  { id: 1, name: "Ribbed Seamless Co-ord Set", price: 649, category: "Fashion", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80", description: "Matching ribbed seamless crop top & high-waist leggings set. Buttery soft, sculpting fit. Available in 8 colours.", stock: 30, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=ribbed+seamless+two+piece+set+women+crop+top+leggings", shippingDays: "7-14" },
  { id: 2, name: "Mini Vegan Leather Crossbody Bag", price: 389, category: "Fashion", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", description: "Compact vegan leather crossbody with adjustable strap. Fits phone, cards & essentials.", stock: 50, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=mini+crossbody+bag+women+vegan+leather+shoulder", shippingDays: "7-14" },
  { id: 3, name: "Oversized Graphic Hoodie", price: 569, category: "Fashion", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", description: "Drop-shoulder oversized hoodie with bold graphic print. 380GSM heavyweight fleece.", stock: 35, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=oversized+graphic+hoodie+women+streetwear+drop+shoulder", shippingDays: "7-15" },
  { id: 4, name: "Resistance Band Kit (5-Piece)", price: 579, category: "Gym", image: "https://images.unsplash.com/photo-1598289431512-b97b0917afea?w=600&q=80", description: "5 resistance levels, door anchor, ankle straps, handles & carry bag. AliExpress #1 home workout product.", stock: 60, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=resistance+band+set+5+piece+handles+door+anchor+workout", shippingDays: "7-14" },
  { id: 5, name: "Ab Roller Wheel Pro", price: 359, category: "Gym", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80", description: "Double-wheel ab roller with non-slip foam handles and thick knee pad. 10,000+ orders on AliExpress.", stock: 45, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=ab+roller+wheel+double+wheel+knee+pad+core+exercise", shippingDays: "7-14" },
  { id: 6, name: "Smart Fitness Jump Rope", price: 489, category: "Gym", image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80", description: "Counts jumps, tracks calories & workout time. Ball-bearing handles, adjustable steel cable.", stock: 40, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=smart+jump+rope+counter+calories+fitness+ball+bearing", shippingDays: "7-14" },
  { id: 7, name: "Cotton Newborn Romper 5-Pack", price: 529, category: "Baby", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80", description: "100% soft cotton onesies in neutral tones. Snap buttons, tagless label, 0-12 months.", stock: 40, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=newborn+baby+romper+cotton+onesie+5+pack+neutral", shippingDays: "10-18" },
  { id: 8, name: "Baby Bottle Warmer", price: 469, category: "Baby", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Portable USB baby bottle warmer with temperature display. Every new parent needs one.", stock: 30, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=baby+bottle+warmer+portable+usb+temperature+display", shippingDays: "7-14" },
  { id: 9, name: "Muslin Swaddle Blanket 3-Pack", price: 429, category: "Baby", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80", description: "100% organic muslin cotton swaddle blankets. Large 120x120cm, breathable & soft. Perfect baby shower gift.", stock: 50, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=muslin+swaddle+blanket+3+pack+organic+cotton+baby", shippingDays: "10-18" },
];

const GOLD = "#C9A84C";
const DARK = "#111111";
const RED = "#CC2200";
const ADMIN_PIN = "1408";
const CATS = ["All", "Fashion", "Gym", "Baby"];
const CAT_META = {
  Fashion: { emoji: "👗", desc: "Streetwear & luxury fits" },
  Gym: { emoji: "🏋️", desc: "Home & performance gear" },
  Baby: { emoji: "🍼", desc: "Soft essentials for little ones" },
};
const STATUS_COLORS = {
  "Pending": { bg: "#FFF8E8", color: "#A07000" },
  "Ordered from Supplier": { bg: "#E8F4FF", color: "#0055BB" },
  "Shipped": { bg: "#F0FFF4", color: "#1A7A3A" },
  "Delivered": { bg: "#F5F5F5", color: "#555" },
};

const Icon = {
  cart: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  back: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  trash: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  edit: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  close: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  plus: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  orders: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  link: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  store: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

function inp(extra) { return { width: "100%", border: "1px solid #E0DED8", borderRadius: 8, padding: "10px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAF8", ...extra }; }
function label(text) { return <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>{text}</label>; }

function CheckoutModal({ cart, total, onClose, onPlaceOrder }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "", postal: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const provinces = ["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"];
  const handleSubmit = () => {
    if (["name","email","phone","address","city","province","postal"].some(k => !form[k])) return alert("Please fill in all fields.");
    onPlaceOrder(form);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>Checkout</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>
        <div style={{ background: "#FAFAF8", borderRadius: 10, padding: "14px 16px", marginBottom: 20, border: "1px solid #ECEAE5" }}>
          {cart.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 500 }}>{i.name} x{i.qty}</span>
              <span style={{ fontWeight: 700 }}>R{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #ECEAE5", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15 }}>
            <span>Total</span><span>R{total.toLocaleString()}</span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {[["name","Full Name","text"],["email","Email Address","email"],["phone","Phone Number","tel"]].map(([k,l,t]) => (
            <div key={k}>{label(l)}<input style={inp()} value={form[k]} onChange={e => set(k, e.target.value)} type={t} /></div>
          ))}
          <div>{label("Street Address")}<input style={inp()} value={form.address} onChange={e => set("address", e.target.value)} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>{label("City")}<input style={inp()} value={form.city} onChange={e => set("city", e.target.value)} /></div>
            <div>{label("Postal Code")}<input style={inp()} value={form.postal} onChange={e => set("postal", e.target.value)} /></div>
          </div>
          <div>{label("Province")}
            <select style={inp()} value={form.province} onChange={e => set("province", e.target.value)}>
              <option value="">Select province...</option>
              {provinces.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ background: "#F0FFF4", borderRadius: 8, padding: "10px 14px", marginTop: 16, fontSize: 12, color: "#1A7A3A", border: "1px solid #B0E8C0" }}>
          Secure payment via PayFast. You will be redirected to complete payment.
        </div>
        <button onClick={handleSubmit} style={{ width: "100%", background: DARK, color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 16 }}>
          Place Order →
        </button>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div><div style={{ fontWeight: 900, fontSize: 18 }}>Order #{order.id}</div><div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{new Date(order.createdAt).toLocaleString("en-ZA")}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>
        <div style={{ background: "#FAFAF8", borderRadius: 10, padding: "14px 16px", marginBottom: 16, border: "1px solid #ECEAE5" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Customer</div>
          {[["Name",order.customer.name],["Email",order.customer.email],["Phone",order.customer.phone],["Address",`${order.customer.address}, ${order.customer.city}, ${order.customer.province} ${order.customer.postal}`]].map(([l,v]) => (
            <div key={l} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 13 }}><span style={{ color: "#999", minWidth: 60 }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Fulfill Items</div>
          {order.items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, padding: "10px 14px", background: "#FAFAF8", borderRadius: 10, border: "1px solid #ECEAE5" }}>
              <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{item.name} x{item.qty}</div><div style={{ fontSize: 12, color: "#999" }}>R{(item.price * item.qty).toLocaleString()}</div></div>
              <a href={item.aliexpressUrl} target="_blank" rel="noreferrer" style={{ background: "#FF6600", color: "#fff", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>{Icon.link} AliExpress</a>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Update Status</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(STATUS_COLORS).map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{ padding: "7px 14px", borderRadius: 8, border: `2px solid ${status === s ? DARK : "#ECEAE5"}`, background: status === s ? DARK : "#fff", color: status === s ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#F2F1EC", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { onUpdateStatus(order.id, status); onClose(); }} style={{ flex: 2, background: DARK, color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const blank = { name: "", price: "", category: "Fashion", image: "", description: "", stock: "", badge: "", aliexpressUrl: "", shippingDays: "7-14" };
  const [form, setForm] = useState(product ? { ...product, price: String(product.price), stock: String(product.stock) } : blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.price || !form.image) return alert("Name, price, and image URL required.");
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, id: product?.id || Date.now() });
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{product ? "Edit Product" : "Add Product"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>
        {[["name","Product Name"],["price","Price (R)"],["image","Image URL"],["stock","Stock Qty"],["aliexpressUrl","AliExpress URL"],["shippingDays","Shipping Days"]].map(([k,l]) => (
          <div key={k} style={{ marginBottom: 14 }}>{label(l)}<input style={inp()} value={form[k]} onChange={e => set(k, e.target.value)} type={k==="price"||k==="stock"?"number":"text"} /></div>
        ))}
        <div style={{ marginBottom: 14 }}>{label("Description")}<textarea style={{ ...inp(), minHeight: 70, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>{label("Category")}<select style={inp()} value={form.category} onChange={e => set("category", e.target.value)}>{["Fashion","Gym","Baby"].map(c => <option key={c}>{c}</option>)}</select></div>
          <div>{label("Badge")}<select style={inp()} value={form.badge} onChange={e => set("badge", e.target.value)}>{["","Trending","Best Seller","New"].map(b => <option key={b} value={b}>{b||"None"}</option>)}</select></div>
        </div>
        {form.image && <img src={form.image} alt="" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} onError={e => e.target.style.display="none"} />}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#F2F1EC", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ flex: 2, background: DARK, color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save Product</button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onUpdateQty, total, onCheckout }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "fixed", top: 0, right: 0, width: "min(420px,100vw)", height: "100vh", background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #ECEAE5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 18 }}>Your Cart ({cart.reduce((s,i)=>s+i.qty,0)})</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0
            ? <div style={{ textAlign: "center", color: "#999", padding: "56px 0" }}><div style={{ fontSize: 44, marginBottom: 14 }}>🛍️</div><div style={{ fontWeight: 600 }}>Your cart is empty</div></div>
            : cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 13, marginBottom: 16, alignItems: "flex-start" }}>
                <img src={item.image} alt={item.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{item.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>R{(item.price * item.qty).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>Ships in {item.shippingDays} days</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => onUpdateQty(item.id, -1)} style={{ background: "#F2F1EC", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontWeight: 700, fontSize: 16 }}>-</button>
                    <span style={{ fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} style={{ background: "#F2F1EC", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontWeight: 700, fontSize: 16 }}>+</button>
                    <button onClick={() => onUpdateQty(item.id, -item.qty)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 4 }}>{Icon.trash}</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid #ECEAE5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, marginBottom: 6 }}><span>Total</span><span>R{total.toLocaleString()}</span></div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>Free shipping · Delivered to your door</div>
            <button onClick={onCheckout} style={{ width: "100%", background: GOLD, color: "#fff", border: "none", borderRadius: 12, padding: "15px", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  const [products, setProducts] = useState(() => load(STORAGE_KEY, defaultProducts));
  const [cart, setCart] = useState(() => load(CART_KEY, []));
  const [orders, setOrders] = useState(() => load(ORDERS_KEY, []));
  const [view, setView] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [modalProduct, setModalProduct] = useState(undefined);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [adminTab, setAdminTab] = useState("products");
  const [pinOpen, setPinOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  useEffect(() => { save(STORAGE_KEY, products); }, [products]);
  useEffect(() => { save(CART_KEY, cart); }, [cart]);
  useEffect(() => { save(ORDERS_KEY, orders); }, [orders]);

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  const handleLogoTap = () => {
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (next >= 5) { setPinOpen(true); setLogoTaps(0); setPinError(false); }
    setTimeout(() => setLogoTaps(0), 3000);
  };

  const handlePinSubmit = () => {
    if (pinInput === ADMIN_PIN) { setAdminUnlocked(true); setPinOpen(false); setPinInput(""); setPinError(false); setView("admin"); }
    else { setPinError(true); setPinInput(""); }
  };

  const addToCart = useCallback((product) => {
    setCart(c => { const ex = c.find(i => i.id === product.id); return ex ? c.map(i => i.id === product.id ? { ...i, qty: i.qty+1 } : i) : [...c, { ...product, qty: 1 }]; });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }, []);

  const updateQty = (id, delta) => setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty+delta } : i).filter(i => i.qty > 0));

  const placeOrder = (customerInfo) => {
    const orderId = String(Date.now()).slice(-6);
    const newOrder = { id: orderId, createdAt: new Date().toISOString(), customer: customerInfo, items: cart.map(i => ({...i})), total: cartTotal, status: "Pending" };
    setOrders(o => [newOrder, ...o]);
    const params = {
      merchant_id: "35699151", merchant_key: "bfldtgx8cgmsk",
      return_url: "https://lm-couture.vercel.app/?payment=success",
      cancel_url: "https://lm-couture.vercel.app/?payment=cancelled",
      name_first: customerInfo.name.split(" ")[0],
      name_last: customerInfo.name.split(" ").slice(1).join(" ") || customerInfo.name,
      email_address: customerInfo.email, cell_number: customerInfo.phone,
      m_payment_id: orderId, amount: cartTotal.toFixed(2),
      item_name: `L&M Holdings Couture Order #${orderId}`,
      item_description: cart.map(i => `${i.name} x${i.qty}`).join(", "),
    };
    const form = document.createElement("form");
    form.method = "POST"; form.action = "https://www.payfast.co.za/eng/process";
    Object.entries(params).forEach(([k, v]) => { const inp = document.createElement("input"); inp.type = "hidden"; inp.name = k; inp.value = v; form.appendChild(inp); });
    document.body.appendChild(form);
    setCart([]); setCheckoutOpen(false); setCartOpen(false);
    form.submit();
  };

  const saveProduct = (prod) => { setProducts(ps => prod.id && ps.find(p => p.id === prod.id) ? ps.map(p => p.id === prod.id ? prod : p) : [...ps, prod]); setModalProduct(undefined); };
  const deleteProduct = (id) => { if (confirm("Delete this product?")) setProducts(ps => ps.filter(p => p.id !== id)); };
  const filteredProducts = activeCat === "All" ? products : products.filter(p => p.category === activeCat);

  const PinModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", width: 300, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 6 }}>Admin Access</div>
        <div style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>Enter your PIN to continue</div>
        <input type="password" inputMode="numeric" maxLength={4} value={pinInput} onChange={e => { setPinInput(e.target.value); setPinError(false); }} onKeyDown={e => e.key === "Enter" && handlePinSubmit()} autoFocus
          style={{ width: "100%", border: `2px solid ${pinError ? RED : "#ECEAE5"}`, borderRadius: 10, padding: "14px", fontSize: 24, textAlign: "center", letterSpacing: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }} placeholder="••••" />
        {pinError && <div style={{ color: RED, fontSize: 12, marginBottom: 12 }}>Incorrect PIN. Try again.</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={() => { setPinOpen(false); setPinInput(""); setPinError(false); }} style={{ flex: 1, background: "#F2F1EC", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={handlePinSubmit} style={{ flex: 1, background: DARK, color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Enter</button>
        </div>
      </div>
    </div>
  );

  const Logo = () => (
    <div style={{ display: "flex", flexDirection: "column", cursor: "pointer", lineHeight: 1.1 }} onClick={handleLogoTap}>
      <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", color: DARK }}>L&M Holdings</span>
      <span style={{ fontWeight: 400, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Couture</span>
    </div>
  );

  const navBtn = { background: "none", border: "1px solid #ECEAE5", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", display: "flex", alignItems: "center", gap: 6 };

  // ADMIN VIEW
  if (view === "admin" && adminUnlocked) return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      {pinOpen && <PinModal />}
      {modalProduct !== undefined && <ProductModal product={modalProduct} onSave={saveProduct} onClose={() => setModalProduct(undefined)} />}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={(id,s) => setOrders(o => o.map(ord => ord.id===id ? {...ord,status:s} : ord))} />}
      <div style={{ background: "#fff", borderBottom: "1px solid #ECEAE5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
        <button style={navBtn} onClick={() => { setAdminUnlocked(false); setView("shop"); }}>{Icon.store} Exit Admin</button>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Admin Panel</div>
        <div style={{ color: "#999", fontSize: 14, marginBottom: 24 }}>{products.length} products · {orders.length} orders</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#F2F1EC", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {[["products","Products",Icon.store],["orders","Orders",Icon.orders]].map(([tab,lbl,icon]) => (
            <button key={tab} onClick={() => setAdminTab(tab)} style={{ background: adminTab===tab?"#fff":"none", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: adminTab===tab?DARK:"#888", display: "flex", alignItems: "center", gap: 6, boxShadow: adminTab===tab?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
              {icon} {lbl} {tab==="orders"&&pendingOrders>0&&<span style={{ background: RED, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 800, padding: "1px 6px" }}>{pendingOrders}</span>}
            </button>
          ))}
        </div>
        {adminTab === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setModalProduct(null)} style={{ background: DARK, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>{Icon.plus} Add Product</button>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ECEAE5", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 80px 80px 70px 100px", gap: 12, padding: "11px 18px", borderBottom: "2px solid #ECEAE5", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", fontWeight: 700 }}>
                <span>Img</span><span>Name</span><span>Cat</span><span>Price</span><span>Stock</span><span>Actions</span>
              </div>
              {products.map(p => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "56px 1fr 80px 80px 70px 100px", gap: 12, padding: "13px 18px", borderBottom: "1px solid #ECEAE5", alignItems: "center", fontSize: 13 }}>
                  <img src={p.image} alt={p.name} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8 }} />
                  <div><div style={{ fontWeight: 600 }}>{p.name}</div>{p.badge&&<span style={{ fontSize: 10, background: "#F2F1EC", borderRadius: 4, padding: "1px 6px", color: "#666", fontWeight: 600 }}>{p.badge}</span>}</div>
                  <span style={{ color: "#777" }}>{p.category}</span>
                  <span style={{ fontWeight: 700 }}>R{p.price.toLocaleString()}</span>
                  <span style={{ color: p.stock<5?RED:"#333", fontWeight: 600 }}>{p.stock}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setModalProduct(p)} style={{ background: "#F0F8FF", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: "#0055BB" }}>{Icon.edit}</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: "#FFF0F0", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: RED }}>{Icon.trash}</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {adminTab === "orders" && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ECEAE5", overflow: "hidden" }}>
            {orders.length === 0
              ? <div style={{ textAlign: "center", padding: "56px 0", color: "#aaa" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📋</div><div style={{ fontWeight: 600 }}>No orders yet</div></div>
              : <>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 100px 110px 80px", gap: 12, padding: "11px 18px", borderBottom: "2px solid #ECEAE5", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", fontWeight: 700 }}>
                  <span>Order</span><span>Customer</span><span>Date</span><span>Total</span><span>Status</span><span>Action</span>
                </div>
                {orders.map(o => {
                  const sc = STATUS_COLORS[o.status] || STATUS_COLORS["Pending"];
                  return (
                    <div key={o.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 100px 110px 80px", gap: 12, padding: "14px 18px", borderBottom: "1px solid #ECEAE5", alignItems: "center", fontSize: 13 }}>
                      <span style={{ fontWeight: 800, color: GOLD }}>#{o.id}</span>
                      <div><div style={{ fontWeight: 600 }}>{o.customer.name}</div><div style={{ fontSize: 11, color: "#aaa" }}>{o.customer.email}</div></div>
                      <span style={{ fontSize: 12, color: "#777" }}>{new Date(o.createdAt).toLocaleDateString("en-ZA")}</span>
                      <span style={{ fontWeight: 700 }}>R{o.total.toLocaleString()}</span>
                      <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{o.status}</span>
                      <button onClick={() => setSelectedOrder(o)} style={{ background: DARK, color: "#fff", border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Fulfill</button>
                    </div>
                  );
                })}
              </>}
          </div>
        )}
      </div>
    </div>
  );

  // DETAIL VIEW
  if (view === "detail" && selectedProduct) return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      {pinOpen && <PinModal />}
      <div style={{ background: "#fff", borderBottom: "1px solid #ECEAE5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
        <button onClick={() => setCartOpen(true)} style={{ background: DARK, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
          {Icon.cart} {cartCount > 0 ? <span style={{ background: GOLD, color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span> : "Cart"}
        </button>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <button onClick={() => setView("shop")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666", marginBottom: 28 }}>{Icon.back} Back to Shop</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", borderRadius: 16, objectFit: "cover", aspectRatio: "1/1" }} />
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>{selectedProduct.category}</div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 12 }}>{selectedProduct.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>R{selectedProduct.price.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 18 }}>Ships in {selectedProduct.shippingDays} business days</div>
            <div style={{ color: "#555", lineHeight: 1.75, marginBottom: 24, fontSize: 15 }}>{selectedProduct.description}</div>
            <div style={{ fontSize: 13, color: selectedProduct.stock < 5 ? RED : "#888", marginBottom: 22 }}>{selectedProduct.stock < 5 ? `Only ${selectedProduct.stock} left` : `${selectedProduct.stock} in stock`}</div>
            <button onClick={() => addToCart(selectedProduct)} style={{ width: "100%", background: addedId===selectedProduct.id?GOLD:DARK, color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {addedId===selectedProduct.id ? <>{Icon.check} Added to Cart</> : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} total={cartTotal} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} onClose={() => setCheckoutOpen(false)} onPlaceOrder={placeOrder} />}
    </div>
  );

  // SHOP VIEW
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#FAFAF8", color: "#111" }}>
      {pinOpen && <PinModal />}
      <div style={{ background: "#fff", borderBottom: "1px solid #ECEAE5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
        <button onClick={() => setCartOpen(true)} style={{ background: DARK, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
          {Icon.cart} {cartCount > 0 ? <span style={{ background: GOLD, color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span> : "Cart"}
        </button>
      </div>

      <div style={{ background: DARK, color: "#fff", padding: "72px 28px 64px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>L&M Holdings Couture · Est. 2026</div>
        <h1 style={{ fontSize: "clamp(34px,6vw,58px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.08, marginBottom: 18, margin: "0 0 18px" }}>Fashion. Fitness.<br /><span style={{ color: GOLD }}>Family.</span></h1>
        <p style={{ color: "#aaa", fontSize: 16, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.6 }}>Curated styles, gym performance gear, and soft baby essentials — shipped to your door.</p>
        <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} style={{ background: GOLD, color: "#fff", border: "none", borderRadius: 10, padding: "15px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Shop the Collection</button>
      </div>

      <div style={{ display: "flex", gap: 14, padding: "28px 24px 8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {Object.entries(CAT_META).map(([cat, meta]) => (
          <div key={cat} onClick={() => { setActiveCat(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ background: "#fff", border: "1px solid #ECEAE5", borderRadius: 14, padding: "18px 22px", minWidth: 160, cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{meta.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>{cat}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{meta.desc}</div>
          </div>
        ))}
      </div>

      <div id="products" style={{ display: "flex", gap: 10, padding: "16px 24px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat===c?DARK:"#fff", color: activeCat===c?"#fff":"#555", border: `1px solid ${activeCat===c?DARK:"#ECEAE5"}`, borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, padding: "8px 24px 56px" }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ECEAE5", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} onClick={() => { setSelectedProduct(p); setView("detail"); }} />
            <div style={{ padding: "14px 15px 16px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: 3 }}>{p.category}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }} onClick={() => { setSelectedProduct(p); setView("detail"); }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>Ships in {p.shippingDays} days</div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontWeight: 800, fontSize: 17 }}>R{p.price.toLocaleString()}</span>
                {p.badge && <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px", marginLeft: 8, background: p.badge==="Trending"?"#FFF8E8":p.badge==="Best Seller"?"#F0F8FF":"#F0FFF4", color: p.badge==="Trending"?"#A07000":p.badge==="Best Seller"?"#0055BB":"#1A7A3A" }}>{p.badge}</span>}
              </div>
              <button onClick={() => addToCart(p)} style={{ width: "100%", background: addedId===p.id?GOLD:DARK, color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 10, transition: "background 0.2s" }}>
                {addedId===p.id ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: DARK, color: "#666", padding: "32px 28px", textAlign: "center", fontSize: 13 }}>
        <div style={{ color: GOLD, fontWeight: 900, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>L&M Holdings Couture</div>
        <div>2026 L&M Holdings. All rights reserved.</div>
      </div>

      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} total={cartTotal} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} onClose={() => setCheckoutOpen(false)} onPlaceOrder={placeOrder} />}
    </div>
  );
}
