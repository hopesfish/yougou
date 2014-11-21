var base = require("./base");
module.exports = function() {
    //require("./testReply")();return;
	require("./testUser")();
	return;
	require("./testActivity")();
	require("./testCoupon")();
	require("./testActivityEnabled")();
	require("./testReply")();
	require("./testRestrict")();
}