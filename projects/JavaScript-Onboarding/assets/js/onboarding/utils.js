function hasRestaurantInfo() {
	const restaurantInfo = localStorage.getItem('restaurant-info');
	const restaurantInfoDismissed = sessionStorage.getItem('restaurant-info-dismissed');

	if (!restaurantInfo) {
		if (restaurantInfoDismissed === 'dismissed') {
			return true;
		}
		return false;
	}
	return true;
}

function dismissRestaurantInfoDialog(status = '') {
	sessionStorage.setItem('restaurant-info-dismissed', status);
}

function saveRestaurantInfo(restaurantInfo = {}) {
	localStorage.setItem('restaurant-info', JSON.stringify(restaurantInfo));
}
