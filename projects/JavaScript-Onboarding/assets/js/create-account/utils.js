function loadAccounts() {
	const accounts = localStorage.getItem('accounts');
	if (accounts) {
		return JSON.parse(accounts);
	}
	return [];
}

function addAccount(account = {}) {
	const accounts = loadAccounts();

	if (account) {
		accounts.push(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));
	}
}

function exploreAccount(email = '') {
  const accounts = loadAccounts();
	const account = accounts.find(a => a['email-address'] === email);

	if (account) return true;
	return false;
}
