// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const serverUrl = 'http://localhost:5000/api';
const storageKey = 'savedAccount';

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

// Define the routes for different pages and their associated titles, templates, and initialization functions.
const routes = {
  '/dashboard': { title: 'My Account', templateId: 'dashboard', init: refresh },
  '/login': { title: 'Login', templateId: 'login' }
};

// Function to navigate to a different page using the browser's history API.
function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path);
  updateRoute();
}

// Function to update the view based on the current route.
function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    return navigate('/dashboard');
  }

  const template = $('#' + route.templateId);
  const view = template.contents().clone(true);
  const app = $('#app');
  app.empty();
  app.append(view);
  
  if (typeof route.init === 'function') {
    route.init();
  }

  document.title = route.title;
}

// ---------------------------------------------------------------------------
// API interactions
// ---------------------------------------------------------------------------

// Function to send HTTP requests to the server's API.
async function sendRequest(api, method, body) {
  try {
    const response = await fetch(serverUrl + api, {
      method: method || 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}

// Function to get account information for a user.
async function getAccount(user) {
  return sendRequest('/accounts/' + encodeURIComponent(user));
}

// Function to create a new account.
async function createAccount(account) {
  return sendRequest('/accounts', 'POST', account);
}

// Function to create a new transaction for a user.
async function createTransaction(user, transaction) {
  return sendRequest('/accounts/' + user + '/transactions', 'POST', transaction);
}

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------

let state = Object.freeze({
  account: null
});

// Function to update the global state object.
function updateState(property, newData) {
  state = Object.freeze({
    ...state,
    [property]: newData
  });
  localStorage.setItem(storageKey, JSON.stringify(state.account));
}

// ---------------------------------------------------------------------------
// Login/register
// ---------------------------------------------------------------------------

// Function to handle user login.
async function login() {
  const loginForm = $('#loginForm');
  const user = loginForm.find('input[name="user"]').val();
  const data = await getAccount(user);

  if (data.error) {
    return updateElement('loginError', data.error);
  }

  updateState('account', data);
  navigate('/dashboard');
}

// Function to handle user registration.
async function register() {
  const registerForm = $('#registerForm');
  const formData = registerForm.serializeArray();
  const data = {};
  
  formData.forEach((input) => {
    data[input.name] = input.value;
  });

  const jsonData = JSON.stringify(data);
  const result = await createAccount(jsonData);

  if (result.error) {
    return updateElement('registerError', result.error);
  }

  updateState('account', result);
  navigate('/dashboard');
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

// Function to update the account data.
async function updateAccountData() {
  const account = state.account;
  if (!account) {
    return logout();
  }

  const data = await getAccount(account.user);
  if (data.error) {
    return logout();
  }

  updateState('account', data);
}

// Function to refresh the dashboard view.
async function refresh() {
  await updateAccountData();
  updateDashboard();
}

// Function to update the dashboard view with account data.
function updateDashboard() {
  const account = state.account;
  if (!account) {
    return logout();
  }

  updateElement('description', account.description);
  updateElement('balance', account.balance.toFixed(2));
  updateElement('currency', account.currency);

  // Update transactions
  const transactionsRows = document.createDocumentFragment();
  for (const transaction of account.transactions) {
    const transactionRow = createTransactionRow(transaction);
    transactionsRows.appendChild(transactionRow);
  }
  updateElement('transactions', transactionsRows);
}

// Function to create a table row for a transaction.
function createTransactionRow(transaction) {
  const template = $('#transaction');
  const transactionRow = template.contents().clone(true);
  const tr = transactionRow.find('tr');
  tr.children().eq(0).text(transaction.date);
  tr.children().eq(1).text(transaction.object);
  tr.children().eq(2).text(transaction.amount.toFixed(2));
  return transactionRow;
}

// Function to show the transaction dialog.
function addTransaction() {
  const dialog = $('#transactionDialog');
  dialog.addClass('show');

  // Reset form
  const transactionForm = $('#transactionForm')[0];
  transactionForm.reset();

  // Set date to today
  transactionForm.date.valueAsDate = new Date();
}

// Function to confirm a transaction.
async function confirmTransaction() {
  const dialog = $('#transactionDialog');
  dialog.removeClass('show');

  const transactionForm = $('#transactionForm')[0];

  const formData = new FormData(transactionForm);
  const jsonData = JSON.stringify(Object.fromEntries(formData));
  const data = await createTransaction(state.account.user, jsonData);

  if (data.error) {
    return updateElement('transactionError', data.error);
  }

  // Update local state with new transaction
  const newAccount = {
    ...state.account,
    balance: state.account.balance + data.amount,
    transactions: [...state.account.transactions, data]
  }
  updateState('account', newAccount);

  // Update display
  updateDashboard();
}

// Function to cancel a transaction.
async function cancelTransaction() {
  const dialog = $('#transactionDialog');
  dialog.removeClass('show');
}

// Function to handle user logout.
function logout() {
  updateState('account', null);
  navigate('/login');
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

// Function to update the content of an element.
function updateElement(id, textOrNode) {
  const element = $('#' + id);
  element.empty();
  element.append(textOrNode);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

// Function to initialize the application.
function init() {
  // Restore state
  const savedState = localStorage.getItem(storageKey);
  if (savedState) {
    updateState('account', JSON.parse(savedState));
  }

  // Update route for browser back/next buttons
  window.onpopstate = () => updateRoute();
  updateRoute();
}

init();