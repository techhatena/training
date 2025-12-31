const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const mobileMenu = document.getElementById("mobileMenu");
const header = document.getElementById("header");
const logo = document.getElementById("logo");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("-translate-y-full");
  menuBtn.classList.add("hidden");
  closeBtn.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  mobileMenu.classList.add("-translate-y-full");
  closeBtn.classList.add("hidden");
  menuBtn.classList.remove("hidden");
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("md:bg-black");
    header.classList.remove("md:bg-transparent");
  } else {
    header.classList.remove("md:bg-black");
    header.classList.add("md:bg-transparent");
  }
});

const slider = document.getElementById("mobileSlider");
const dots = document.querySelectorAll(".dot");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
  isDown = false;
});

slider.addEventListener("mouseup", () => {
  isDown = false;
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.2;
  slider.scrollLeft = scrollLeft - walk;
});

slider.addEventListener("scroll", () => {
  const slideWidth = slider.clientWidth;
  const scrollPos = slider.scrollLeft;
  const activeIndex = Math.round(scrollPos / slideWidth);

  dots.forEach((dot, index) => {
    dot.classList.remove("active");
    if (index === activeIndex) {
      dot.classList.add("active");
    }
  });
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    const slideWidth = slider.clientWidth;
    slider.scrollLeft = index * slideWidth;
  });
});

const codedProjects = [
  {
    title: "Coffee shop",
    description: "Coffee ordering web app",
    image: "images/coded-img/coffee.jpg",
    demo: "#",
    type: "coded",
  },

  {
    title: "EatSome",
    description: "Restaurant ordering web app",
    image: "images/coded-img/restaurant.jpg",
    demo: "#",
    type: "coded",
  },
  {
    title: "Clothing shop",
    description: "Clothing shop ordering web app",
    image: "images/coded-img/clothing-shop.jpg",
    demo: "#",
    type: "coded",
  },
];
const designedProjects = [
  {
    title: "Neon Concept",
    description: "Futuristic UI design",
    image: "images/designed-img/neon-concept.jpg",
    demo: "#",
    type: "designed",
  },
  {
    title: "Car Photography",
    description: "Dark cinematic photoshoot",
    image: "images/designed-img/Photography.jpg",
    demo: "#",
    type: "designed",
  },
  {
    title: "Design anime ",
    description: "Anime photoshoot",
    image: "images/designed-img/anime-concept.jpg",
    demo: "#",
    type: "designed",
  },
];
const projectGrid = document.getElementById("projectGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
function renderProjects(projects) {
  projectGrid.innerHTML = "";

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className =
      "group relative overflow-hidden rounded-lg cursor-pointer";

    projectCard.innerHTML = `
      <img src="${project.image}"
           class="w-full h-64 object-cover group-hover:scale-110 transition duration-500" />

      <div class="absolute inset-0 bg-black/70 opacity-0 
                  group-hover:opacity-100 transition flex flex-col 
                  justify-center items-center text-center px-5">
        <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
        <p class="text-sm text-gray-300 mb-4">${project.description}</p>
        <a href="${project.demo}" target="_blank"
           class="border-l border-r px-4 py-2 text-xs tracking-widest hover:bg-white hover:text-black transition">
           DEMO
        </a>
      </div>
    `;

    projectGrid.appendChild(projectCard);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    if (filter === "all") {
      renderProjects([...codedProjects, ...designedProjects]);
    }

    if (filter === "coded") {
      renderProjects(codedProjects);
    }

    if (filter === "designed") {
      renderProjects(designedProjects);
    }

    filterButtons.forEach((b) => {
      b.classList.remove("text-white", "border-b-2", "border-b-white");
      b.classList.add("text-gray-400", "border-b-transparent");
    });
    btn.classList.add("text-white", "border-b-2", "border-b-white");
    btn.classList.remove("text-gray-400", "border-b-transparent");
  });
});

window.addEventListener("load", () => {
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');
  if (allButton) {
    allButton.click();
  }
});
