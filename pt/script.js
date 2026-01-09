document.querySelectorAll('.portfolio-tabs button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.portfolio-tabs button').forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');
        const index = button.getAttribute('data-index');
        const slider = document.querySelector('.portfolio-slider');
        slider.style.transform = `translateX(-${(index * 100) / 3}%)`;
    });
});

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    clearErrors();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    let isValid = true;

    if (name.value.trim() === "") {
        showError(name, "Please enter your name");
        isValid = false;
    }

    if (email.value.trim() === "") {
        showError(email, "Please enter your email");
        isValid = false;
    }

    if (phone.value.trim() === "") {
        showError(phone, "Please enter your phone number");
        isValid = false;
    }

    if (!isValid) return;

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email.value.trim())) {
        showError(email, "Email must be a valid Gmail address");
        isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        showError(phone, "Phone number must contain exactly 10 digits");
        isValid = false;
    }
    if (isValid) {
        form.reset();
        alert("Message sent successfully!");
    }
});

function showError(input, message) {
    const group = input.closest(".form-group");
    group.querySelector(".error-msg").innerText = message;
}

function clearErrors() {
    document.querySelectorAll(".error-msg").forEach(el => {
        el.innerText = "";
    });
}


