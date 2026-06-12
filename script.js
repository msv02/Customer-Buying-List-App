/* ======================================================
   SAKTHI AFFILIATES – Products Data

   HOW TO ADD YOUR PRODUCTS:
   1. Copy the block below (between the { } lines)
   2. Paste it inside the products = [ ] array
   3. Fill in: name, description, price, category, image, link
   4. Save the file and refresh the browser

   Categories you can use:
   electronics / fashion / fitness / home / beauty / books / gaming / accessories
   ====================================================== */

// ============ CATEGORY ICONS (used on product cards) ============
const categories = [
  { id: "electronics",  name: "Electronics",   icon: "📱" },
  { id: "fashion",      name: "Fashion",        icon: "👗" },
  { id: "fitness",      name: "Fitness",        icon: "💪" },
  { id: "home",         name: "Home & Kitchen", icon: "🏠" },
  { id: "beauty",       name: "Beauty",         icon: "✨" },
  { id: "books",        name: "Books",          icon: "📚" },
  { id: "gaming",       name: "Gaming",         icon: "🎮" },
  { id: "accessories",  name: "Accessories",    icon: "⌚" },
];

// ============ YOUR PRODUCTS — ADD HERE ============
const products = [
  // PASTE YOUR PRODUCTS BELOW THIS LINE
  {
    id: "boldhealth-gel-eye-mask",
    name: "BoldHealth Cooling Gel Eye Mask",
    description: "Stretchable & adjustable eye gel mask with soft velvet backing for dark circles, puffiness, and stress relief.",
    price: "₹199",
    image: "https://res.cloudinary.com/dbqd8ehhf/image/upload/q_auto/f_auto/v1781197038/81FrL0enhnL_ygm5le.jpg",
    link: "https://www.amazon.in/BoldHealth-Cooling-Circles-Stretchable-Relaxing/dp/B0B4WTMRSS?crid=3SO7IIL1E87DJ&dib=eyJ2IjoiMSJ9.SMHcs6JDHAoxnSE0FAVLk-mwsFVaE0myJINpOVjhaIQoW5a_wRGJPx_og2hqEhEILwJ7SggBfjjmreKu3nJ_Cv3btcmwZ0lkcPipS8U-Ic89WTPmvxcEHkcn7MQkIEJNFf9MpeoOItcGOW4P0ytq607ZaSAbbXWTfj00w1mAawldFZXKbVUkP2uotmWLen7iB8mBL2xCZwmYigaWjJ8Uky5ofliJzP4txCAtOQrtHSs_dG31azisfpOaWhZx_4gB8SsszPxy1hhv9Iu67_H13AzpN85kNPQVMUwSxGL5Wic.VSJlYZdjaO7UlaxTpFsiLifPgyeYjddy1fJQjpu18mA&dib_tag=se&keywords=eye%2Bmask%2Bwith%2Bgel%2Btype&qid=1781196722&sprefix=%2Caps%2C529&sr=8-1-spons&aref=mXcnixCA6Y&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=msv026-21&linkId=24cd83905e28ffb822efe1b54126f2fa&ref_=as_li_ss_tl"
  },
  {
    id: "deconstruct-gel-sunscreen",
    name: "Deconstruct Face Gel Sunscreen SPF 55+",
    description: "A photostable, lightweight, and non-greasy gel sunscreen that protects combination-to-oily skin without leaving a white cast.",
    image: "https://res.cloudinary.com/dbqd8ehhf/image/upload/q_auto/f_auto/v1781199620/deconstruct-lightweight-gel-sunscreen-spf-55-and-pa-50-gm_1_display_1772096223_eb987728.jpg_shggze.webp",
    link: "https://www.amazon.in/Deconstruct-Photostable-Lightweight-Non-greasy-combination/dp/B0B45RB1RV?crid=AK0P23UB6Z2Q&dib=eyJ2IjoiMSJ9.dNZSHit4IDLj1ubqNuTXPg2OKKk9eV5J0Scc_upaB_P2md6gCgpvriEjIBPDZj0Jr273tduuTXE_Z7Rjcll2h_2cm2YpMhu_qz0dKyLoYmwRTJoAzOtL9-VPhucbK0Zi7bMwoN5b_X6oX3dgH-zedVFDBJEACdrzmja0Z7vx3X5urEsMWnK2ataH9N90tUVwQZ-_01YMziK_V2Z-NJvXhKIHvOBOp1AZRzYGh-6UCSdTLHBsV7-ERUFWJdfM6unaOVNi_cYAl_mZVyRKHBjeoyp33PboGjmmt42lZ3vPi0I.yxarrf3nLgtw-EPh22Hl19dXUOpVVIYZo2uiFm2TW9g&dib_tag=se&keywords=sunscreen&qid=1781199533&sprefix=sunscreen%2Caps%2C401&sr=8-5&th=1&linkCode=ll2&tag=msv026-21&linkId=0f6907e49f194ca90a8399c398365717&ref_=as_li_ss_tl"
  },
  {
    id: "reen-naturals-beetroot-soap",
    name: "Reen Naturals Beetroot Brightening Soap",
    description: "Handcrafted soap enriched with beetroot extracts and essential oils to gently cleanse and brighten your skin naturally.",
    image: "https://res.cloudinary.com/dbqd8ehhf/image/upload/q_auto/f_auto/v1781200579/Untitled_design_6.png_lfm3gp.webp",
    link: "https://www.amazon.in/Naturals-Brightening-Beetroot-Extracts-Essential/dp/B0DT99VHKW?crid=1NA6ZRG8RUSDB&dib=eyJ2IjoiMSJ9.6ZT3nnH5PsW_17J2n7ASqEapyl7CMt_-hFx48OilP5WZOm6tMOvPbAiaX1EVr_I0nH9M0aC-om7NUtR3KqtJGDxBpHusNtteNeHB-BdYtFiMn2mvYAsZyju24xd-mNVBFma5yW0fF9200IHidkBR01kojLt0WH_AaDU3-ID1DKDea4lTZldoTQ3d3F2aqyrQyoy0xzzfsMHs_Mdfy0A_4gN_6S44JyjIj2ogh5JxlL4kCBdfpPvc6CVsW6pC8B-Idy2_B853RVwfV_nbuBO_-JNxiCMpHs39nhEh2TpfZS4.1ldhhUKK9asiRUpTddAkVg8wdWfZbvJU6y9e1kiVR4c&dib_tag=se&keywords=reen%2Bnaturals%2Bsoap&qid=1781198769&sprefix=reen%2B%2Caps%2C797&sr=8-5&th=1&linkCode=ll2&tag=msv026-21&linkId=e08c0d966a5fdb0f908e03269487f574&ref_=as_li_ss_tl"
  },
  {
    id: "klm-nevlon-moisturizer",
    name: "KLM Nevlon Intense Moisturizing Cream",
    description: "Formulated for extended hydration and deep skin nourishment, suitable for dry and sensitive skin.",
    image: "https://res.cloudinary.com/dbqd8ehhf/image/upload/q_auto/f_auto/v1781200618/ChatGPT_Image_Jun_11_2026_at_11_26_32_PM_rqi1ic.png",
    link: "https://www.amazon.in/KLM-Moisturizing-Extended-Hydration-Suitable/dp/B0D3Z7QQW8?crid=EC0A5JB86G16&dib=eyJ2IjoiMSJ9.5x_9-2w5nIRiR2KashaxlavjHnj9bx0vELTIU25Y22fngoCfkoggUlxgXq3MLBZzh3yTFn8odyJBqO_wEoz6YaMsKpIPoImvgOS77VmKjXeSgIUB_CiZ-UtxuGmDbFFVn6RiVO2MEE73rHnsg8g-ACaNGnrsvKeG4lLQqR65OojtzJhPVmnW3xlVsyRPMit_ykRGkxeaISq-v4Hlk3spvyJyTU351rOJmOrZcvZfAhE.Pne6WBCj5AOhLqR5FnChOD5MJofa5u0CTUkrmaFvwNU&dib_tag=se&keywords=nevlon+intense&qid=1781200166&sprefix=nevlon+inten%2Caps%2C527&sr=8-2&linkCode=ll2&tag=msv026-21&linkId=d66d3238a8957d4d7283cf59fafc2080&ref_=as_li_ss_tl"
  },
  {
    id: "diamond-color-contact-lenses",
    name: "Diamond Monthly Color Contact Lenses",
    description: "Premium monthly color contact lenses that provide exceptional comfort and a natural, vibrant eye enhancement.",
    image: "https://res.cloudinary.com/dbqd8ehhf/image/upload/q_auto/f_auto/v1781273477/ChatGPT_Image_Jun_12_2026_at_07_40_08_PM_pxsxei.png",
    link: "https://www.amazon.in/Diamond-Monthly-Color-Contact-Lenses/dp/B0837QW56H?crid=2HJUEXIEBYTK7&dib=eyJ2IjoiMSJ9.5cMK0qQHSAUCCdHkJZ-93yqVd9_kmz97nOqMsxd9h4TGS_cvsY3b6ZPW6oQSyn__DOZ8UqaNJnccAhUzMO_hCUQbknyAqkD6C1bXcvixjRVdQlAfFf12YWTqgxFuhjO5yZWU1SKAHe_d4YjnZ7CqNzkVQS_JePyVZmS4RQQBLtbjAl61IH2dzX5mdBvEQ8FgRVqR4tH9BH-wW-ZH8OXR0NbHHmm4vaIsRweUk24RIU-g1V5mZKcaQDmBITerQi2ZcsOB9V_-qeUxeVWJTDZKL7f1WkwtSETUAGr6tM2iAB4.RDKDVfi-477drJyHbMhcqJIGOFYJ8F3rIBLAgj76Qc4&dib_tag=se&keywords=blue+monthly+contact+lens+zero+power&qid=1781272580&sprefix=blue+monthly+contact+lens+zero+power%2Caps%2C621&sr=8-9&linkCode=ll2&tag=msv026-21&linkId=534d9dc2b32a0db2ad4cc092e4b9adc5&ref_=as_li_ss_tl"
  }
];
// ============ END OF PRODUCTS ============


// ======================================================
// APP LOGIC — no need to edit below this line
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initMobileMenu();
  initBackToTop();
});

// --- Render all products ---
function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (products.length === 0) return; // show nothing if no products added

  products.forEach((product, i) => {
    const cat = categories.find(c => c.id === product.category);
    const icon = cat ? cat.icon : "🛍️";
    const catName = cat ? cat.name : "";

    const imgContent = product.image
      ? `<img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy"
           onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>${icon}</div>'">`
      : `<div class="img-placeholder">${icon}</div>`;

    const card = document.createElement("a");
    card.className = "product-card fade-in-up";
    card.href = product.link || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.id = `product-${product.id}`;
    card.style.animationDelay = `${i * 0.07}s`;

    card.innerHTML = `
      <div class="product-img-wrap">
        ${imgContent}
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.description}</div>
        <div class="product-footer">
          <span class="product-shop-link">
            Shop Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// --- Mobile menu ---
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const links = document.getElementById("nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      btn.classList.remove("open");
      links.classList.remove("open");
    });
  });
}

// --- Back to top ---
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
