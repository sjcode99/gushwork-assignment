const images = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
];

function Carousel() {
  const imgElement = document.getElementById("mainCarouselImg");
  const prevBtn = document.querySelector(".carousel-btn.prev-btn");
  const nextBtn = document.querySelector(".carousel-btn.next-btn");
  const thumbnailItems = document.querySelectorAll(".thumbnail-item");
  const zoomWrapper = document.getElementById("imgZoomWrapper");
  const zoomLens = document.getElementById("zoomLens");
  const zoomPreview = document.getElementById("zoomPreview");

  if (!imgElement || !zoomWrapper || !zoomLens || !zoomPreview) return;

  let currentIndex = 0;

  // Setup Thumbnails
  thumbnailItems.forEach((item, index) => {
    if (images[index]) {
      const img = document.createElement("img");
      img.src = images[index];
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.pointerEvents = "none";
      item.appendChild(img);

      item.addEventListener("click", () => {
        currentIndex = index;
        updateImage();
      });
    } else {
      item.classList.add("empty");
    }
  });

  function updateImage() {
    imgElement.style.opacity = 0; // Fade out
    thumbnailItems.forEach((i) => i.classList.remove("active"));
    if (thumbnailItems[currentIndex]) {
      thumbnailItems[currentIndex].classList.add("active");
    }

    setTimeout(() => {
      imgElement.src = images[currentIndex];
      imgElement.style.opacity = 1; // Fade in
      initZoom(); // Re-sync zoom background
    }, 300);
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  // --- Zoom Logic ---
  const ZOOM_RATIO = 2.5;

  function initZoom() {
    zoomPreview.style.backgroundImage = `url('${imgElement.src}')`;
    zoomPreview.style.backgroundSize = `${imgElement.width * ZOOM_RATIO}px ${imgElement.height * ZOOM_RATIO}px`;
  }

  zoomWrapper.addEventListener("mouseenter", () => {
    zoomLens.classList.add("active");
    zoomPreview.classList.add("active");
    initZoom();
  });

  zoomWrapper.addEventListener("mouseleave", () => {
    zoomLens.classList.remove("active");
    zoomPreview.classList.remove("active");
  });

  zoomWrapper.addEventListener("mousemove", (e) => {
    e.preventDefault();

    // Safety check just in case image hasn't fully loaded dimensions
    if (!imgElement.width) return;

    const wrapperRect = zoomWrapper.getBoundingClientRect();
    const lensRect = zoomLens.getBoundingClientRect();

    // Cursor mapping: pointer relative to container
    let x = e.clientX - wrapperRect.left;
    let y = e.clientY - wrapperRect.top;

    // Lens coordinates mapped to be centered on cursor
    let lensX = x - lensRect.width / 2;
    let lensY = y - lensRect.height / 2;

    // Bound the lens inside the container
    if (lensX > wrapperRect.width - lensRect.width)
      lensX = wrapperRect.width - lensRect.width;
    if (lensX < 0) lensX = 0;
    if (lensY > wrapperRect.height - lensRect.height)
      lensY = wrapperRect.height - lensRect.height;
    if (lensY < 0) lensY = 0;

    zoomLens.style.left = `${lensX}px`;
    zoomLens.style.top = `${lensY}px`;

    // Background scaling and translating for preview
    // Adjust scale factors exactly by the zoom ratio computed
    const bgPosX = -(lensX * ZOOM_RATIO);
    const bgPosY = -(lensY * ZOOM_RATIO);

    zoomPreview.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  });

  // Set initial
  updateImage();
}

function FAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all currently active FAQs
      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("active");
      });

      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

function AppCarousel() {
  const carousel = document.getElementById("appCarousel");
  const prevBtn = document.getElementById("appPrevBtn");
  const nextBtn = document.getElementById("appNextBtn");

  if (!carousel || !prevBtn || !nextBtn) return;

  const scrollAmount = 300; // rough width of a card

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Carousel();
  FAQAccordion();
  AppCarousel();
});
