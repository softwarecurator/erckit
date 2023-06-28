const Navigators = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function () {
		return (
			Navigators.Android() ||
			Navigators.BlackBerry() ||
			Navigators.iOS() ||
			Navigators.Opera() ||
			Navigators.Windows()
		);
	},
	isMobile: function () {
		return Navigators.Android() || Navigators.BlackBerry() || Navigators.iOS();
	}
};

export default Navigators;
