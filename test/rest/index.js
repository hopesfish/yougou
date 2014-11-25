var base = require("./base");
module.exports = function() {
	require("./testUser")();
	require("./testAutoreply")();
	require("./testActivity")();
	require("./testCoupon")();
	require("./testCouponEnabled")();
	require("./testCouponRestrict")();
	require("./testDream")();
	require("./testDreamVote")();
}