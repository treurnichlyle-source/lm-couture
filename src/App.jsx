import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "lm_couture_products";
const CART_KEY = "lm_couture_cart";
const ORDERS_KEY = "lm_couture_orders";

const defaultProducts = [
  // ── FASHION ──
  { id: 1, name: "Seamless Contour Leggings", price: 499, category: "Fashion", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", description: "Buttery-soft seamless leggings with contour shading. High waist, squat-proof.", stock: 30, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=seamless+contour+leggings", shippingDays: "7-15" },
  { id: 2, name: "Oversized Satin Shirt", price: 569, category: "Fashion", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4466?w=600&q=80", description: "Luxe satin-finish oversized shirt. Doubles as outerwear or a statement blouse.", stock: 25, badge: "New", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=oversized+satin+shirt", shippingDays: "10-20" },
  { id: 3, name: "Ribbed Crop Co-ord Set", price: 699, category: "Fashion", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80", description: "Matching ribbed crop top and wide-leg trouser set. Elevated everyday style.", stock: 20, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=ribbed+crop+coord+set", shippingDays: "7-15" },
  { id: 4, name: "Mini Crossbody Bag", price: 399, category: "Fashion", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", description: "Compact adjustable crossbody. Fits your essentials. Vegan leather.", stock: 40, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=mini+crossbody+bag+vegan+leather", shippingDays: "7-14" },
  { id: 13, name: "Y2K Butterfly Print Mini Dress", price: 649, category: "Fashion", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80", description: "Nostalgic Y2K butterfly print mini dress. Floaty fabric, adjustable straps. Major TikTok trend.", stock: 22, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=y2k+butterfly+print+mini+dress", shippingDays: "7-14" },
  { id: 14, name: "Oversized Graphic Hoodie", price: 589, category: "Fashion", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", description: "Drop-shoulder oversized hoodie with bold graphic print. Heavyweight 380GSM fleece.", stock: 35, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=oversized+graphic+hoodie+streetwear", shippingDays: "7-15" },
  { id: 15, name: "Wide Leg Linen Trousers", price: 529, category: "Fashion", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", description: "Breathable linen-blend wide-leg trousers. High waist, elastic back. Perfect for SA summers.", stock: 28, badge: "New", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=wide+leg+linen+trousers+women", shippingDays: "7-14" },
  { id: 16, name: "Chunky Gold Chain Necklace", price: 249, category: "Fashion", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", description: "Statement chunky gold-tone chain necklace. Tarnish-resistant. Stacks beautifully.", stock: 60, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=chunky+gold+chain+necklace+statement", shippingDays: "7-14" },
  // ── GYM ──
  { id: 5, name: "Adjustable Dumbbell Set", price: 2299, category: "Gym", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80", description: "5–52.5 lb adjustable dumbbells. Dial-select mechanism. Space-efficient for home gyms.", stock: 10, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=adjustable+dumbbell+set+home+gym", shippingDays: "15-25" },
  { id: 6, name: "Smart Resistance Band Kit", price: 599, category: "Gym", image: "https://images.unsplash.com/photo-1598289431512-b97b0917afea?w=600&q=80", description: "5-piece resistance band set with handles, door anchor, ankle straps & carry bag.", stock: 50, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=resistance+band+kit+set", shippingDays: "7-15" },
  { id: 7, name: "Bluetooth Jump Rope", price: 519, category: "Gym", image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80", description: "Tracks jumps, calories, and workout time via app. Ball-bearing handles, adjustable cable.", stock: 35, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=smart+bluetooth+jump+rope", shippingDays: "7-14" },
  { id: 8, name: "Foam Roller & Massage Set", price: 449, category: "Gym", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80", description: "Deep tissue foam roller + 2 massage balls. Essential post-workout recovery kit.", stock: 45, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=foam+roller+massage+ball+set", shippingDays: "7-15" },
  { id: 17, name: "Ab Roller Wheel Pro", price: 379, category: "Gym", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80", description: "Double-wheel ab roller with non-slip handles and knee pad. Core strength essential.", stock: 40, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=ab+roller+wheel+exercise", shippingDays: "7-14" },
  { id: 18, name: "Weightlifting Belt", price: 499, category: "Gym", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80", description: "4-inch genuine leather weightlifting belt. Quick-release buckle. Supports heavy lifts.", stock: 25, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=weightlifting+leather+belt+gym", shippingDays: "7-15" },
  { id: 19, name: "Gym Water Bottle 1L", price: 329, category: "Gym", image: "https://images.unsplash.com/photo-1553531384-397c80973a0b?w=600&q=80", description: "1-litre motivational time-marker water bottle. Leak-proof, BPA free, with straw lid.", stock: 70, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=motivational+gym+water+bottle+1+litre", shippingDays: "7-14" },
  // ── BABY ──
  { id: 9, name: "Newborn Romper 5-Pack", price: 549, category: "Baby", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80", description: "100% soft cotton onesies in neutral tones. Snap buttons, tagless. 0–12 months.", stock: 35, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=newborn+cotton+romper+onesie+pack", shippingDays: "10-20" },
  { id: 10, name: "Baby Night Light Projector", price: 399, category: "Baby", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Projects stars & animals on the ceiling. Timer, USB rechargeable. Soothes babies to sleep.", stock: 28, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=baby+night+light+star+projector", shippingDays: "7-14" },
  { id: 11, name: "Knit Cardigan & Booties Set", price: 399, category: "Baby", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80", description: "Handknit-style cardigan with matching booties. Ultra-soft yarn, perfect gift.", stock: 20, badge: "New", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=baby+knit+cardigan+booties+set", shippingDays: "10-18" },
  { id: 12, name: "Portable Clip-On Baby Fan", price: 289, category: "Baby", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80", description: "USB rechargeable clip-on fan for prams. Whisper-quiet, 3 speed settings.", stock: 60, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=portable+clip+on+baby+stroller+fan", shippingDays: "7-14" },
  { id: 20, name: "Baby Food Maker & Steamer", price: 899, category: "Baby", image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80", description: "4-in-1 baby food processor: steam, blend, reheat & defrost. BPA-free bowl, easy clean.", stock: 15, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=baby+food+maker+steamer+blender", shippingDays: "10-18" },
  { id: 21, name: "Muslin Swaddle Blanket 3-Pack", price: 449, category: "Baby", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80", description: "100% organic muslin cotton swaddle blankets. Breathable, large 120x120cm. Neutral prints.", stock: 45, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=muslin+swaddle+blanket+organic+cotton", shippingDays: "10-18" },
  // ── BEAUTY ──
  { id: 22, name: "Gua Sha & Jade Roller Set", price: 349, category: "Beauty", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80", description: "Real rose quartz gua sha + jade roller duo. Reduces puffiness, boosts circulation. Viral TikTok favourite.", stock: 55, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=gua+sha+jade+roller+rose+quartz+set", shippingDays: "7-14" },
  { id: 23, name: "LED Face Mask Therapy", price: 1299, category: "Beauty", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", description: "7-colour LED light therapy mask. Red for anti-aging, blue for acne. Rechargeable, 20-min sessions.", stock: 18, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=led+face+mask+light+therapy+7+color", shippingDays: "7-15" },
  { id: 24, name: "Ice Roller Face Massager", price: 279, category: "Beauty", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80", description: "Freeze & roll for instant de-puffing. Soothes redness, tightens pores. Reusable gel head.", stock: 50, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=ice+roller+face+massager+skin+care", shippingDays: "7-14" },
  { id: 25, name: "Vitamin C Serum 30ml", price: 299, category: "Beauty", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80", description: "20% Vitamin C + hyaluronic acid serum. Brightens, firms, fades dark spots. All skin types.", stock: 65, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=vitamin+c+serum+brightening+hyaluronic+acid", shippingDays: "7-14" },
  { id: 26, name: "Electric Facial Cleanser Brush", price: 459, category: "Beauty", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", description: "Silicone sonic facial cleansing brush. 3 speeds, waterproof, USB rechargeable. Deep pore clean.", stock: 30, badge: "New", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=electric+silicone+facial+cleansing+brush+sonic", shippingDays: "7-14" },
  // ── TECH ──
  { id: 27, name: "Wireless Earbuds Pro", price: 799, category: "Tech", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", description: "Active noise cancellation, 30hr battery life, IPX5 waterproof. Works with Android & iOS.", stock: 40, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=wireless+earbuds+anc+noise+cancelling", shippingDays: "7-14" },
  { id: 28, name: "MagSafe Wireless Charger Pad", price: 449, category: "Tech", image: "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=600&q=80", description: "15W fast wireless charging pad. Compatible with Android & iPhone. LED indicator, anti-slip base.", stock: 50, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=magsafe+wireless+charger+pad+15w", shippingDays: "7-14" },
  { id: 29, name: "Portable 20000mAh Power Bank", price: 699, category: "Tech", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80", description: "20,000mAh slim power bank. Dual USB + USB-C, fast charge. Charges phone 5x. Load-shedding essential.", stock: 35, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=portable+power+bank+20000mah+fast+charge", shippingDays: "7-14" },
  { id: 30, name: "Smart Watch Fitness Tracker", price: 899, category: "Tech", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80", description: "Heart rate, SpO2, sleep tracking, 100+ sport modes. 7-day battery. Android & iOS.", stock: 25, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=smart+watch+fitness+tracker+heart+rate", shippingDays: "7-14" },
  { id: 31, name: "Phone Stand & Ring Light", price: 389, category: "Tech", image: "https://images.unsplash.com/photo-1616161560417-2c6a9f4ea65e?w=600&q=80", description: "Adjustable ring light with phone holder. 3 light modes, 10 brightness levels. TikTok content essential.", stock: 45, badge: "New", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=ring+light+phone+stand+tiktok+selfie", shippingDays: "7-14" },
  // ── HOME ──
  { id: 32, name: "Aesthetic Desk Lamp LED", price: 599, category: "Home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", description: "Minimalist LED desk lamp with wireless charging base. Touch dimmer, 3 colour temps. Pinterest favourite.", stock: 30, badge: "Trending", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=aesthetic+led+desk+lamp+wireless+charging", shippingDays: "7-15" },
  { id: 33, name: "Aromatherapy Diffuser", price: 499, category: "Home", image: "https://images.unsplash.com/photo-1608181831718-c9fca8ce0e4b?w=600&q=80", description: "300ml ultrasonic essential oil diffuser. 7 LED colours, auto shut-off, whisper quiet.", stock: 40, badge: "Best Seller", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=aromatherapy+essential+oil+diffuser+ultrasonic", shippingDays: "7-14" },
  { id: 34, name: "Magnetic Knife Strip", price: 349, category: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", description: "40cm stainless steel magnetic knife holder. Wall-mounted, no tools needed. Holds 8+ knives.", stock: 55, badge: "", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=magnetic+knife+strip+wall+mount+stainless", shippingDays: "7-14" },
  { id: 35, name: "Bedside Organiser Caddy", price: 329, category: "Home", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", description: "Hanging bedside caddy with phone pocket, book sleeve & remote holder. Fits any bed frame.", stock: 50, badge: "New", aliexpressUrl: "https://www.aliexpress.com/wholesale?SearchText=bedside+organiser+caddy+hanging+bed", shippingDays: "7-14" },
];

function load(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
}
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const GOLD = "#C9A84C";
const DARK = "#111111";
const RED = "#CC2200";
const ADMIN_PIN = "1408"; // ← change this to your PIN

const Icon = {
  cart: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  admin: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>,
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

const CATS = ["All", "Fashion", "Gym", "Baby", "Beauty", "Tech", "Home"];
const CAT_META = {
  Fashion: { emoji: "👗", desc: "Streetwear & luxury fits" },
  Gym: { emoji: "🏋️", desc: "Home & performance gear" },
  Baby: { emoji: "🍼", desc: "Soft essentials for little ones" },
  Beauty: { emoji: "✨", desc: "Skincare & glow tools" },
  Tech: { emoji: "📱", desc: "Gadgets & accessories" },
  Home: { emoji: "🏠", desc: "Aesthetic home essentials" },
};

const STATUS_COLORS = {
  "Pending": { bg: "#FFF8E8", color: "#A07000" },
  "Ordered from Supplier": { bg: "#E8F4FF", color: "#0055BB" },
  "Shipped": { bg: "#F0FFF4", color: "#1A7A3A" },
  "Delivered": { bg: "#F5F5F5", color: "#555" },
};

// ── Checkout Form ─────────────────────────────────────────────────────────────
function CheckoutModal({ cart, total, onClose, onPlaceOrder }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "", postal: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const provinces = ["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"];

  const handleSubmit = () => {
    const required = ["name","email","phone","address","city","province","postal"];
    if (required.some(k => !form[k])) return alert("Please fill in all fields.");
    onPlaceOrder(form);
  };

  const inp = { width: "100%", border: "1px solid #E0DED8", borderRadius: 8, padding: "10px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAF8" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>Checkout</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>

        {/* Order summary */}
        <div style={{ background: "#FAFAF8", borderRadius: 10, padding: "14px 16px", marginBottom: 20, border: "1px solid #ECEAE5" }}>
          {cart.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 500 }}>{i.name} × {i.qty}</span>
              <span style={{ fontWeight: 700 }}>R{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #ECEAE5", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15 }}>
            <span>Total</span><span>R{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {[["name","Full Name"],["email","Email Address"],["phone","Phone Number"]].map(([k,l]) => (
            <div key={k}>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>{l}</label>
              <input style={inp} value={form[k]} onChange={e => set(k, e.target.value)} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>Street Address</label>
            <input style={inp} value={form.address} onChange={e => set("address", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>City</label>
              <input style={inp} value={form.city} onChange={e => set("city", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>Postal Code</label>
              <input style={inp} value={form.postal} onChange={e => set("postal", e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>Province</label>
            <select style={{ ...inp }} value={form.province} onChange={e => set("province", e.target.value)}>
              <option value="">Select province...</option>
              {provinces.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ background: "#F0FFF4", borderRadius: 8, padding: "10px 14px", marginTop: 16, fontSize: 12, color: "#1A7A3A", border: "1px solid #B0E8C0" }}>
          🔒 Secure payment via PayFast. You will be redirected to complete payment safely.
        </div>

        <button onClick={handleSubmit} style={{ width: "100%", background: DARK, color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 16 }}>
          Place Order →
        </button>
      </div>
    </div>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Order #{order.id}</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{new Date(order.createdAt).toLocaleString("en-ZA")}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>

        {/* Customer info */}
        <div style={{ background: "#FAFAF8", borderRadius: 10, padding: "14px 16px", marginBottom: 16, border: "1px solid #ECEAE5" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Customer</div>
          {[["Name", order.customer.name],["Email", order.customer.email],["Phone", order.customer.phone],["Address", `${order.customer.address}, ${order.customer.city}, ${order.customer.province}, ${order.customer.postal}`]].map(([l,v]) => (
            <div key={l} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 13 }}>
              <span style={{ color: "#999", minWidth: 60 }}>{l}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Items + fulfill buttons */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Items to Fulfill</div>
          {order.items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, padding: "10px 14px", background: "#FAFAF8", borderRadius: 10, border: "1px solid #ECEAE5" }}>
              <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name} × {item.qty}</div>
                <div style={{ fontSize: 12, color: "#999" }}>R{(item.price * item.qty).toLocaleString()}</div>
              </div>
              <a href={item.aliexpressUrl} target="_blank" rel="noreferrer"
                style={{ background: "#FF6600", color: "#fff", border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                {Icon.link} Order on AliExpress
              </a>
            </div>
          ))}
        </div>

        {/* Status update */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Update Status</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(STATUS_COLORS).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                style={{ padding: "7px 14px", borderRadius: 8, border: `2px solid ${status === s ? DARK : "#ECEAE5"}`, background: status === s ? DARK : "#fff", color: status === s ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#F2F1EC", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { onUpdateStatus(order.id, status); onClose(); }}
            style={{ flex: 2, background: DARK, color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Product Modal ─────────────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const blank = { name: "", price: "", category: "Fashion", image: "", description: "", stock: "", badge: "", aliexpressUrl: "", shippingDays: "7-14" };
  const [form, setForm] = useState(product ? { ...product, price: String(product.price), stock: String(product.stock) } : blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { width: "100%", border: "1px solid #E0DED8", borderRadius: 8, padding: "10px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#FAFAF8" };

  const handleSave = () => {
    if (!form.name || !form.price || !form.image) return alert("Name, price, and image URL are required.");
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, id: product?.id || Date.now() });
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{product ? "Edit Product" : "Add Product"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
        </div>
        {[["name","Product Name"],["price","Price (R)"],["image","Image URL"],["stock","Stock Qty"],["aliexpressUrl","AliExpress Search URL"],["shippingDays","Shipping Days (e.g. 7-14)"]].map(([k,l]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>{l}</label>
            <input style={inp} value={form[k]} onChange={e => set(k, e.target.value)} type={k === "price" || k === "stock" ? "number" : "text"} />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>Description</label>
          <textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>Category</label>
            <select style={{ ...inp }} value={form.category} onChange={e => set("category", e.target.value)}>
              {["Fashion","Gym","Baby","Beauty","Tech","Home"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 5 }}>Badge</label>
            <select style={{ ...inp }} value={form.badge} onChange={e => set("badge", e.target.value)}>
              {["","Trending","Best Seller","New"].map(b => <option key={b} value={b}>{b || "None"}</option>)}
            </select>
          </div>
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

// ── Cart Drawer ───────────────────────────────────────────────────────────────
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
                    <button onClick={() => onUpdateQty(item.id, -1)} style={{ background: "#F2F1EC", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontWeight: 700, fontSize: 16 }}>−</button>
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
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>Free shipping on all orders · Delivered to your door</div>
            <button onClick={onCheckout} style={{ width: "100%", background: GOLD, color: "#fff", border: "none", borderRadius: 12, padding: "15px", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
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

  const handleLogoTap = () => {
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (next >= 5) { setPinOpen(true); setLogoTaps(0); setPinError(false); }
    setTimeout(() => setLogoTaps(0), 3000);
  };

  const handlePinSubmit = () => {
    if (pinInput === ADMIN_PIN) {
      setAdminUnlocked(true);
      setPinOpen(false);
      setPinInput("");
      setPinError(false);
      setView("admin");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  useEffect(() => { save(STORAGE_KEY, products); }, [products]);
  useEffect(() => { save(CART_KEY, cart); }, [cart]);
  useEffect(() => { save(ORDERS_KEY, orders); }, [orders]);

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);

  const addToCart = useCallback((product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      return ex ? c.map(i => i.id === product.id ? { ...i, qty: i.qty+1 } : i) : [...c, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }, []);

  const updateQty = (id, delta) => setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty+delta } : i).filter(i => i.qty > 0));

  const placeOrder = (customerInfo) => {
    const orderId = String(Date.now()).slice(-6);
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: customerInfo,
      items: cart.map(i => ({ ...i })),
      total: cartTotal,
      status: "Pending",
    };
    setOrders(o => [newOrder, ...o]);

    // PayFast payment redirect
    const MERCHANT_ID = "35699151";
    const MERCHANT_KEY = "bfldtgx8cgmsk";
    const RETURN_URL = "https://lm-couture.vercel.app/?payment=success";
    const CANCEL_URL = "https://lm-couture.vercel.app/?payment=cancelled";
    const NOTIFY_URL = "https://lm-couture.vercel.app/api/notify"; // optional ITN

    const params = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      name_first: customerInfo.name.split(" ")[0],
      name_last: customerInfo.name.split(" ").slice(1).join(" ") || customerInfo.name,
      email_address: customerInfo.email,
      cell_number: customerInfo.phone,
      m_payment_id: orderId,
      amount: cartTotal.toFixed(2),
      item_name: `L&M Holdings Couture Order #${orderId}`,
      item_description: cart.map(i => `${i.name} x${i.qty}`).join(", "),
    };

    // Build PayFast form and auto-submit
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.payfast.co.za/eng/process";
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    form.submit();
  };

  const updateOrderStatus = (orderId, status) => setOrders(o => o.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  const saveProduct = (prod) => {
    setProducts(ps => prod.id && ps.find(p => p.id === prod.id) ? ps.map(p => p.id === prod.id ? prod : p) : [...ps, prod]);
    setModalProduct(undefined);
  };
  const deleteProduct = (id) => { if (confirm("Delete this product?")) setProducts(ps => ps.filter(p => p.id !== id)); };
  const filteredProducts = activeCat === "All" ? products : products.filter(p => p.category === activeCat);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  const PinModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", width: 300, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 6 }}>Admin Access</div>
        <div style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>Enter your PIN to continue</div>
        <input
          type="password" inputMode="numeric" maxLength={4}
          value={pinInput}
          onChange={e => { setPinInput(e.target.value); setPinError(false); }}
          onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
          autoFocus
          style={{ width: "100%", border: `2px solid ${pinError ? RED : "#ECEAE5"}`, borderRadius: 10, padding: "14px", fontSize: 24, textAlign: "center", letterSpacing: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
          placeholder="••••"
        />
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
      <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", color: DARK }}>L&amp;M Holdings</span>
      <span style={{ fontWeight: 400, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Couture</span>
    </div>
  );

  const navBtn = { background: "none", border: "1px solid #ECEAE5", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", display: "flex", alignItems: "center", gap: 6 };

  if (view === "admin" && adminUnlocked) return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      {pinOpen && <PinModal />}
      {modalProduct !== undefined && <ProductModal product={modalProduct} onSave={saveProduct} onClose={() => setModalProduct(undefined)} />}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateOrderStatus} />}

      <div style={{ background: "#fff", borderBottom: "1px solid #ECEAE5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
        <div style={{ display: "flex", gap: 8 }}>
          <button style={navBtn} onClick={() => { setAdminUnlocked(false); setView("shop"); }}>{Icon.store} Exit Admin</button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Admin Panel</div>
        <div style={{ color: "#999", fontSize: 14, marginBottom: 24 }}>L&amp;M Holdings Couture · {products.length} products · {orders.length} orders</div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#F2F1EC", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {[["products","Products",Icon.store],["orders","Orders",Icon.orders]].map(([tab,label,icon]) => (
            <button key={tab} onClick={() => setAdminTab(tab)}
              style={{ background: adminTab === tab ? "#fff" : "none", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: adminTab === tab ? DARK : "#888", display: "flex", alignItems: "center", gap: 6, boxShadow: adminTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {icon} {label} {tab === "orders" && pendingOrders > 0 && <span style={{ background: RED, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 800, padding: "1px 6px" }}>{pendingOrders}</span>}
            </button>
          ))}
        </div>

        {/* Products tab */}
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
                  <div><div style={{ fontWeight: 600 }}>{p.name}</div>{p.badge && <span style={{ fontSize: 10, background: "#F2F1EC", borderRadius: 4, padding: "1px 6px", color: "#666", fontWeight: 600 }}>{p.badge}</span>}</div>
                  <span style={{ color: "#777" }}>{p.category}</span>
                  <span style={{ fontWeight: 700 }}>R{p.price.toLocaleString()}</span>
                  <span style={{ color: p.stock < 5 ? RED : "#333", fontWeight: 600 }}>{p.stock}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setModalProduct(p)} style={{ background: "#F0F8FF", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: "#0055BB" }}>{Icon.edit}</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: "#FFF0F0", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: RED }}>{Icon.trash}</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Orders tab */}
        {adminTab === "orders" && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ECEAE5", overflow: "hidden" }}>
            {orders.length === 0
              ? <div style={{ textAlign: "center", padding: "56px 0", color: "#aaa" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📋</div><div style={{ fontWeight: 600 }}>No orders yet</div></div>
              : <>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 100px 110px 80px", gap: 12, padding: "11px 18px", borderBottom: "2px solid #ECEAE5", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", fontWeight: 700 }}>
                  <span>Order</span><span>Customer</span><span>Date</span><span>Total</span><span>Status</span><span>Action</span>
                </div>
                {orders.map(o => {
                  const sc = STATUS_COLORS[o.status] || STATUS_COLORS["Pending"];
                  return (
                    <div key={o.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 100px 110px 80px", gap: 12, padding: "14px 18px", borderBottom: "1px solid #ECEAE5", alignItems: "center", fontSize: 13 }}>
                      <span style={{ fontWeight: 800, color: GOLD }}>#{o.id}</span>
                      <div><div style={{ fontWeight: 600 }}>{o.customer.name}</div><div style={{ fontSize: 11, color: "#aaa" }}>{o.customer.email}</div></div>
                      <span style={{ fontSize: 12, color: "#777" }}>{new Date(o.createdAt).toLocaleDateString("en-ZA")}</span>
                      <span style={{ fontWeight: 700 }}>R{o.total.toLocaleString()}</span>
                      <span style={{ ...sc, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{o.status}</span>
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

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedProduct) return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #ECEAE5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setCartOpen(true)} style={{ background: DARK, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
            {Icon.cart} {cartCount > 0 ? <span style={{ background: GOLD, color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span> : "Cart"}
          </button>
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <button onClick={() => setView("shop")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666", marginBottom: 28 }}>{Icon.back} Back to Shop</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", borderRadius: 16, objectFit: "cover", aspectRatio: "1/1" }} />
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>{selectedProduct.category}</div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 12 }}>{selectedProduct.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>R{selectedProduct.price.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 18 }}>🚚 Ships in {selectedProduct.shippingDays} business days</div>
            <div style={{ color: "#555", lineHeight: 1.75, marginBottom: 24, fontSize: 15 }}>{selectedProduct.description}</div>
            <div style={{ fontSize: 13, color: selectedProduct.stock < 5 ? RED : "#888", marginBottom: 22 }}>
              {selectedProduct.stock < 5 ? `⚠️ Only ${selectedProduct.stock} left` : `✓ ${selectedProduct.stock} in stock`}
            </div>
            <button onClick={() => addToCart(selectedProduct)}
              style={{ width: "100%", background: addedId === selectedProduct.id ? GOLD : DARK, color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {addedId === selectedProduct.id ? <>{Icon.check} Added to Cart</> : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} total={cartTotal} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} onClose={() => setCheckoutOpen(false)} onPlaceOrder={placeOrder} />}
    </div>
  );

  // ── SHOP VIEW ──
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#FAFAF8", color: "#111" }}>
      {pinOpen && <PinModal />}
      <div style={{ background: "#fff", borderBottom: "1px solid #ECEAE5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setCartOpen(true)} style={{ background: DARK, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
            {Icon.cart} {cartCount > 0 ? <span style={{ background: GOLD, color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span> : "Cart"}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: DARK, color: "#fff", padding: "72px 28px 64px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>L&amp;M Holdings Couture · Est. 2026</div>
        <h1 style={{ fontSize: "clamp(34px,6vw,58px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.08, marginBottom: 18, margin: "0 0 18px" }}>
          Fashion. Fitness.<br /><span style={{ color: GOLD }}>Family.</span>
        </h1>
        <p style={{ color: "#aaa", fontSize: 16, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.6 }}>Curated styles, gym performance gear, and soft baby essentials — shipped to your door.</p>
        <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          style={{ background: GOLD, color: "#fff", border: "none", borderRadius: 10, padding: "15px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Shop the Collection
        </button>
      </div>

      {/* Category cards */}
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

      {/* Filter chips */}
      <div id="products" style={{ display: "flex", gap: 10, padding: "16px 24px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)}
            style={{ background: activeCat === c ? DARK : "#fff", color: activeCat === c ? "#fff" : "#555", border: `1px solid ${activeCat === c ? DARK : "#ECEAE5"}`, borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, padding: "8px 24px 56px" }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ECEAE5", cursor: "pointer", transition: "box-shadow 0.15s,transform 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} onClick={() => { setSelectedProduct(p); setView("detail"); }} />
            <div style={{ padding: "14px 15px 16px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: 3 }}>{p.category}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, lineHeight: 1.3 }} onClick={() => { setSelectedProduct(p); setView("detail"); }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>🚚 {p.shippingDays} days</div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontWeight: 800, fontSize: 17 }}>R{p.price.toLocaleString()}</span>
                {p.badge && <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px", marginLeft: 8, background: p.badge === "Trending" ? "#FFF8E8" : p.badge === "Best Seller" ? "#F0F8FF" : "#F0FFF4", color: p.badge === "Trending" ? "#A07000" : p.badge === "Best Seller" ? "#0055BB" : "#1A7A3A" }}>{p.badge}</span>}
              </div>
              <button onClick={() => addToCart(p)}
                style={{ width: "100%", background: addedId === p.id ? GOLD : DARK, color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 10, transition: "background 0.2s" }}>
                {addedId === p.id ? "✓ Added" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: DARK, color: "#666", padding: "32px 28px", textAlign: "center", fontSize: 13 }}>
        <div style={{ color: GOLD, fontWeight: 900, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>L&amp;M Holdings Couture</div>
        <div>© 2026 L&amp;M Holdings. All rights reserved.</div>
      </div>

      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} total={cartTotal} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutModal cart={cart} total={cartTotal} onClose={() => setCheckoutOpen(false)} onPlaceOrder={placeOrder} />}
    </div>
  );
}
