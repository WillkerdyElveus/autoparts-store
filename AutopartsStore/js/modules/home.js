import { fetchData,renderProducts } from "./fetchWrapper.js";

export async function initCarousel() {
  // 1) Grab the empty indicators and inner containers
  const indicators = document.querySelector(
    "#carouselCaptions .carousel-indicators"
  );
  const inner = document.querySelector(
    "#carouselCaptions .carousel-inner"
  );

  // 2) get the first 5 products
  let slides = [];
  try {
    const all = await fetchData("https://fakestoreapi.com/products?limit=5");
    slides = all.slice(0, 5);
  } catch (err) {
    console.error("Carousel load failed", err);
    return;
  }

  // 3) Build indicators & slide items
  slides.forEach((p, idx) => {
    // Indicator button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-bs-target", "#carouselCaptions");
    btn.setAttribute("data-bs-slide-to", idx);
    if (idx === 0) btn.classList.add("active");
    btn.setAttribute("aria-label", `Slide ${idx + 1}`);
    if (idx === 0) btn.setAttribute("aria-current", "true");
    indicators.appendChild(btn);

    // Slide item
    const slide = document.createElement("div");
    slide.className = idx === 0 ? "carousel-item active" : "carousel-item";
    slide.innerHTML = `
      <img src="${p.image}" class="d-block w-100" alt="${p.title}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${p.title}</h5>
        <p>${p.description.slice(0, 80)}…</p>
      </div>
    `;
    inner.appendChild(slide);
  });

  new bootstrap.Carousel(document.getElementById("carouselCaptions"), {
    interval: 3000,
    ride: "carousel",
  });
}
