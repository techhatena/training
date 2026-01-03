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
    image: "images/designed-img/photography.jpg",
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

// Phone input validation - only allow numbers
const phoneInput = document.getElementById("phoneInput");
phoneInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

// Web3Forms submission
const contactForm = document.getElementById("contactForm");
const notificationBox = document.getElementById("notificationBox");
const notificationOverlay = document.getElementById("notificationOverlay");
const loadingSpinner = document.getElementById("loadingSpinner");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const submitBtn = document.getElementById("submitBtn");

// Set access key from config
if (typeof ACCESS_KEY !== "undefined" && ACCESS_KEY.WEB3FORMS_ACCESS_KEY) {
  const accessKeyInput = document.getElementById("accessKeyInput");
  if (accessKeyInput) {
    accessKeyInput.value = ACCESS_KEY.WEB3FORMS_ACCESS_KEY;
  }
}

function showNotification(type) {
  loadingSpinner.classList.add("hidden");
  successMessage.classList.add("hidden");
  errorMessage.classList.add("hidden");

  if (type === "loading") {
    loadingSpinner.classList.remove("hidden");
  } else if (type === "success") {
    successMessage.classList.remove("hidden");
  } else if (type === "error") {
    errorMessage.classList.remove("hidden");
  }

  notificationBox.classList.remove("hidden");
  notificationOverlay.classList.remove("hidden");
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    const formData = new FormData(contactForm);
    const originalText = submitBtn.textContent;

    showNotification("loading");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response from Web3Forms:", data);
      console.log("Response status:", response.ok, response.status);

      if (response.ok) {
        console.log("✅ Email sent successfully!");
        showNotification("success");
        contactForm.reset();

        // Auto-close notification after 3 seconds
        setTimeout(() => {
          notificationBox.classList.add("hidden");
          notificationOverlay.classList.add("hidden");
        }, 3000);
      } else {
        throw new Error(data.message || "Form submission failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      document.getElementById("errorText").textContent =
        error.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      showNotification("error");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
} else {
  console.error("Contact form not found!");
}
