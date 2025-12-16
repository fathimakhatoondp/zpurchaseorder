/*global QUnit*/

sap.ui.define([
	"com/sap/zpurchaseorder/controller/ProductDetails.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProductDetails Controller");

	QUnit.test("I should test the ProductDetails controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
