/**
 * Banaswadi College of Nursing - Form Submission & Validation Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdmissionForm();
  initCallbackForm();
  initContactForm();
  initNewsletterForm();
});

function initAdmissionForm() {
  const form = document.getElementById('admissionsApplyForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = form.querySelector('[name="full_name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const course = form.querySelector('[name="course"]')?.value;

    if (!fullName || !email || !phone || !course) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Application...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      closeModal('admissionModal');
      form.reset();

      // Show comprehensive success modal
      showAdmissionSuccessModal(fullName, course);
    }, 1200);
  });
}

function initCallbackForm() {
  const form = document.getElementById('callbackRequestForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="cb_name"]')?.value.trim();
    const phone = form.querySelector('[name="cb_phone"]')?.value.trim();

    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Requesting...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Request Call Back';
      closeModal('callbackModal');
      form.reset();
      showToast(`Thank you ${name}! Our admissions counselor will call you within 2 business hours.`);
    }, 1000);
  });
}

function initContactForm() {
  const form = document.getElementById('contactPageForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      form.reset();
      showToast('Your message has been sent successfully! Our administrative office will get back to you shortly.');
    }, 1200);
  });
}

function initNewsletterForm() {
  const form = document.getElementById('footerNewsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      input.value = '';
      showToast('Thank you for subscribing to Banaswadi Nursing academic updates & CNE alerts!');
    }
  });
}

function showAdmissionSuccessModal(applicantName, courseName) {
  let modal = document.getElementById('applicationSuccessModal');
  const appNo = 'BCN-2027-' + Math.floor(100000 + Math.random() * 900000);

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'applicationSuccessModal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content-card" style="text-align:center; max-width:540px;">
      <div style="width:70px; height:70px; background:var(--med-green-light); color:var(--med-green); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:2.2rem; margin:0 auto 1.25rem auto;">
        <i class="fa-solid fa-check"></i>
      </div>
      <h3 style="font-size:1.6rem; color:var(--primary-navy); margin-bottom:0.5rem;">Application Registered!</h3>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
        Congratulations <strong>${applicantName}</strong>! Your application for <strong>${courseName}</strong> has been successfully initiated for the academic year 2027-2028.
      </p>
      <div style="background:var(--bg-slate); border:1px dashed var(--border-light); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; text-align:left;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem; font-size:0.85rem;">
          <span style="color:var(--text-light);">Application Reference No:</span>
          <strong style="color:var(--primary-navy);">${appNo}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
          <span style="color:var(--text-light);">Admission Status:</span>
          <span style="color:var(--med-green); font-weight:700;">Under Review / Verification</span>
        </div>
      </div>
      <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:1.75rem;">
        Our admissions committee has dispatched confirmation details and document submission guidelines to your email.
      </p>
      <button class="btn-primary-apply" style="width:100%; justify-content:center;" onclick="closeModal('applicationSuccessModal')">
        Close & Continue Browsing
      </button>
    </div>
  `;

  modal.classList.add('open');
}
