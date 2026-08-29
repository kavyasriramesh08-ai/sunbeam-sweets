const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.auth-form');
const statusMessage = document.getElementById('statusMessage');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartToggle = document.querySelector('.cart-toggle');
const closeCart = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');
const selectionModal = document.getElementById('selectionModal');
const selectionPrompt = document.getElementById('selectionPrompt');
const selectionChoices = document.getElementById('selectionChoices');
const closeSelection = document.querySelector('.close-selection');
const addToCartBtn = document.querySelector('.add-to-cart-btn');

const credentials = {
  user: {
    email: 'user@sunbeamsweets.com',
    password: '123456',
  },
  delivery: {
    id: 'DP-1024',
    password: 'partner123',
  },
};

const menuItems = [
  {
    name: 'Cupcakes',
    price: 120,
    options: ['Chocolate swirl', 'Strawberry cream', 'Vanilla confetti'],
  },
  {
    name: 'Muffins',
    price: 180,
    options: ['Blueberry crumb', 'Banana oat', 'Choco chip'],
  },
  {
    name: 'Whole Cakes',
    price: 699,
    options: ['Small', 'Medium', 'Large'],
  },
  {
    name: 'Fresh Juices',
    price: 120,
    options: ['Mango blast', 'Orange zest', 'Lemon mint'],
  },
  {
    name: 'Latte',
    price: 220,
    options: ['Regular', 'Hazelnut', 'Caramel'],
  },
  {
    name: 'Americano',
    price: 180,
    options: ['Small', 'Medium', 'Large'],
  },
  {
    name: 'Mocha',
    price: 260,
    options: ['Classic', 'Extra chocolate', 'Iced'],
  },
];

let cart = [];
let pendingItem = null;

function updateCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartTotal.textContent = '₹0';
    cartCount.textContent = '0';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
          <div class="cart-item-details">
            <strong>${item.name}</strong>
            <span>${item.option}</span>
            <span>₹${item.price}</span>
          </div>
          <button class="remove-item" data-index="${index}" type="button">Remove</button>
        </div>
      `
    )
    .join('');

  cartTotal.textContent = `₹${total}`;
  cartCount.textContent = String(cart.length);

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      cart.splice(index, 1);
      updateCart();
    });
  });
}

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

    const emailInput = form.querySelector('input[type="email"]');
    const textInput = form.querySelector('input[type="text"]');
    const passwordInput = form.querySelector('input[type="password"]');

    const role = form.id.includes('delivery') ? 'delivery' : 'user';
    const enteredValue = emailInput ? emailInput.value.trim() : textInput.value.trim();
    const password = passwordInput.value.trim();

    if (!enteredValue || !password) {
      statusMessage.textContent = 'Please fill in all fields.';
      statusMessage.style.color = '#c68a00';
      return;
    }

    if (role === 'user') {
      if (credentials.user.email === enteredValue && credentials.user.password === password) {
        statusMessage.textContent = 'Welcome back! Your sweet order tray is ready.';
        statusMessage.style.color = '#0f8a5f';
      } else {
        statusMessage.textContent = 'Invalid user credentials.';
        statusMessage.style.color = '#bf3d5d';
      }
    } else {
      if (credentials.delivery.id === enteredValue && credentials.delivery.password === password) {
        statusMessage.textContent = 'Delivery partner logged in successfully.';
        statusMessage.style.color = '#0f8a5f';
      } else {
        statusMessage.textContent = 'Invalid delivery partner credentials.';
        statusMessage.style.color = '#bf3d5d';
      }
    }
  });
});

function openSelectionModal(item) {
  pendingItem = item;
  selectionPrompt.textContent = `Select ${item.name === 'Whole Cakes' || item.name === 'Americano' ? 'size' : 'flavor'} for ${item.name}.`;
  selectionChoices.innerHTML = item.options
    .map(
      (option, index) => `
        <label class="option-item ${index === 0 ? 'selected' : ''}">
          <input type="radio" name="choice" value="${option}" ${index === 0 ? 'checked' : ''} />
          <span>${option}</span>
        </label>
      `
    )
    .join('');

  selectionChoices.querySelectorAll('.option-item').forEach((option) => {
    option.addEventListener('click', () => {
      selectionChoices.querySelectorAll('.option-item').forEach((itemEl) => itemEl.classList.remove('selected'));
      option.classList.add('selected');
      option.querySelector('input').checked = true;
    });
  });

  selectionModal.classList.add('show');
  selectionModal.setAttribute('aria-hidden', 'false');
}

document.querySelectorAll('.product-meta button, .luxury-meta button, .coffee-meta button').forEach((button) => {
  button.addEventListener('click', () => {
    const itemName = button.closest('.product-card, .luxury-card, .coffee-card')?.querySelector('h3')?.textContent;
    const item = menuItems.find((menuItem) => menuItem.name === itemName) || menuItems.find((menuItem) => button.closest('.coffee-card') && menuItem.name === 'Latte');

    if (item) {
      openSelectionModal(item);
    }
  });
});

addToCartBtn.addEventListener('click', () => {
  if (!pendingItem) return;

  const selected = selectionChoices.querySelector('input[name="choice"]:checked')?.value || pendingItem.options[0];

  cart.push({
    ...pendingItem,
    option: selected,
  });

  selectionModal.classList.remove('show');
  selectionModal.setAttribute('aria-hidden', 'true');
  pendingItem = null;
  updateCart();
  cartPanel.classList.add('open');
});

closeSelection.addEventListener('click', () => {
  selectionModal.classList.remove('show');
  selectionModal.setAttribute('aria-hidden', 'true');
  pendingItem = null;
});

cartToggle.addEventListener('click', () => {
  cartPanel.classList.toggle('open');
});

closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    statusMessage.textContent = 'Your cart is empty. Add some desserts first.';
    statusMessage.style.color = '#bf3d5d';
    return;
  }

  statusMessage.textContent = 'Order placed successfully! Your desserts are on the way.';
  statusMessage.style.color = '#0f8a5f';
  cart = [];
  updateCart();
  cartPanel.classList.remove('open');
});

updateCart();
