// Scripts for Leads Vault Solutions
document.addEventListener('DOMContentLoaded', function () {
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    reveals.forEach((element) => observer.observe(element));
  } else {
    // Fallback: reveal all
    reveals.forEach(el => el.classList.add('visible'));
  }

  const leadForm = document.querySelector('#lead-form');
  const formStatus = document.querySelector('#form-status');

  if (leadForm && formStatus) {
    leadForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(leadForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone') || 'Not provided';
      const market = formData.get('market') || 'Not provided';
      const message = formData.get('message');
      const subject = encodeURIComponent(`Lead inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMarket: ${market}\n\nDetails:\n${message}`
      );

      window.location.href = `mailto:hello@leadsvaultsolutions.com?subject=${subject}&body=${body}`;
      formStatus.textContent = 'Your email app should open with the details filled in.';
    });
  }
});
