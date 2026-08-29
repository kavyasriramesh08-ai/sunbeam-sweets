const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.auth-form');
const statusMessage = document.getElementById('statusMessage');

const credentials = {
  user: {
    email: 'user@paperbloom.com',
    password: '123456',
  },
  admin: {
    email: 'admin@paperbloom.com',
    password: 'admin123',
  },
};

function switchTab(role) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.role === role;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  forms.forEach((form) => {
    const isActive = form.id === `${role}LoginForm`;
    form.classList.toggle('active', isActive);
  });

  statusMessage.textContent = '';
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.role));
});

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value.trim();
    const role = form.id.includes('admin') ? 'admin' : 'user';

    if (!email || !password) {
      statusMessage.textContent = 'Please fill in both email and password.';
      statusMessage.style.color = '#bf2f6d';
      return;
    }

    if (credentials[role].email === email && credentials[role].password === password) {
      statusMessage.textContent = `Welcome back, ${role === 'admin' ? 'Admin' : 'User'}! Your stationery dashboard is ready.`;
      statusMessage.style.color = '#0f9f6e';
    } else {
      statusMessage.textContent = 'Invalid credentials. Please use the demo login details below.';
      statusMessage.style.color = '#bf2f6d';
    }
  });
});
