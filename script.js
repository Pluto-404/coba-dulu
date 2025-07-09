// === Scroll Progress ===
window.onscroll = () => {
  const scroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scroll / height) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
};

// === Theme Picker ===
const themePicker = document.getElementById("themePicker");
const themes = ["neon", "earth", "dark", "analog", "pastel"];
const savedTheme = localStorage.getItem("theme");

if (savedTheme && themes.includes(savedTheme)) {
  document.body.classList.add(savedTheme);
  themePicker.value = savedTheme;
}

themePicker.addEventListener("change", () => {
  document.body.classList.remove(...themes);
  const selected = themePicker.value;
  if (themes.includes(selected)) {
    document.body.classList.add(selected);
    localStorage.setItem("theme", selected);
  } else {
    localStorage.removeItem("theme");
  }
});

// === Mobile Menu Toggle ===
document.getElementById("menuToggle").onclick = () => {
  document.querySelector(".nav-links").classList.toggle("active");
};

// === Like Button ===
document.querySelectorAll(".like-btn").forEach(button => {
  const count = button.querySelector(".like-count");
  const img = button.closest(".gallery-item").querySelector("img");
  const key = "likes-" + img.src;
  const saved = localStorage.getItem(key);
  if (saved) {
    count.textContent = saved;
    button.classList.add("liked");
  }

  button.addEventListener("click", () => {
    let value = parseInt(count.textContent);
    value++;
    count.textContent = value;
    button.classList.add("liked", "pulse");
    localStorage.setItem(key, value);
    setTimeout(() => button.classList.remove("pulse"), 300);
  });
});

// === Filter & Sort ===
const filterButtons = document.querySelectorAll(".filter-btns button");
const galleryItems = document.querySelectorAll(".gallery-item");
let currentTag = "all";

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentTag = button.dataset.filter;
    updateVisibleItems();
  });
});

document.getElementById("sort").addEventListener("change", () => {
  const items = Array.from(galleryItems);
  const container = document.querySelector(".gallery-masonry");
  const value = document.getElementById("sort").value;

  const sorted = items.sort((a, b) => {
    if (value === "newest") return new Date(b.dataset.date) - new Date(a.dataset.date);
    if (value === "oldest") return new Date(a.dataset.date) - new Date(b.dataset.date);
    if (value === "popular") return b.dataset.likes - a.dataset.likes;
  });

  container.innerHTML = "";
  sorted.forEach(item => container.appendChild(item));
  updateVisibleItems();
});

// === Load More ===
const allItems = Array.from(galleryItems);
const loadBtn = document.getElementById("loadMore");
let visibleCount = 3;
let allShown = false;

function updateVisibleItems() {
  let count = 0;
  allItems.forEach(item => {
    const tags = item.dataset.tags.toLowerCase().split(",");
    const show = currentTag === "all" || tags.includes(currentTag);
    item.style.display = (show && count++ < visibleCount) ? "block" : "none";
  });

  const match = allItems.filter(i => currentTag === "all" || i.dataset.tags.toLowerCase().split(",").includes(currentTag));
  loadBtn.textContent = visibleCount >= match.length ? "Muat Lebih Sedikit" : "Muat Lebih Banyak";
  allShown = visibleCount >= match.length;
  loadBtn.style.display = match.length > 3 ? "block" : "none";
}

loadBtn.addEventListener("click", () => {
  visibleCount = allShown ? 3 : allItems.length;
  updateVisibleItems();
});

// === Quote ===
const quotes = [
  "Capture the moment before it disappears.",
  "Every picture tells a story.",
  "Shoot what you feel.",
  "Life is blurry without focus."
];
document.getElementById("quote").textContent = quotes[Math.floor(Math.random() * quotes.length)];

updateVisibleItems();

const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("toggleMusic");
let isPlaying = false;

// Mulai hanya setelah interaksi pertama
document.body.addEventListener("click", () => {
  if (!isPlaying) {
    music.play().then(() => {
      toggleBtn.textContent = "🔊";
      isPlaying = true;
    }).catch(err => {
      console.warn("Autoplay gagal:", err);
    });
  }
}, { once: true });

toggleBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    toggleBtn.textContent = "🔇";
  } else {
    music.play().then(() => {
      toggleBtn.textContent = "🔊";
    });
  }
  isPlaying = !isPlaying;
});

