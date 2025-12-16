/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/sap/zpurchaseorder/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
