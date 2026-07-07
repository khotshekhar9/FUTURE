const sections = Array.from(document.querySelectorAll('main section'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const revealElements = Array.from(document.querySelectorAll('.reveal'));
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    rootMargin: '-35% 0px -45% 0px',
    threshold: 0.2,
  }
);

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const scrollToTarget = (target) => {
  const offset = 88;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      scrollToTarget(target);
      history.pushState(null, '', targetId);
      setActiveLink(target.id);
    }
  });
});

const form = document.getElementById("contactForm");
const status = document.getElementById("form-status");

// Safeguard: Only run if the form exists on the current page
if (form && status) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        status.className = "form-status sending";
        status.textContent = "Sending message...";

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.className = "form-status success";
                status.textContent = "Message sent successfully! I'll get back to you soon.";
                form.reset();
            } else {
                status.className = "form-status error";
                const responseData = await response.json();
                status.textContent = responseData.errors ? responseData.errors.map(err => err.message).join(", ") : "Oops! Problem submitting form.";
            }
        } catch (error) {
            status.className = "form-status error";
            status.textContent = "Oops! There was a network connectivity issue.";
        }
    });
}
