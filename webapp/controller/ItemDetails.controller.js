sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.sap.zpurchaseorder.controller.ProductDetails", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("ItemDetails").attachPatternMatched(this.onRouteMatched, this);
        },
        onRouteMatched: function (oEvent) {
            var sOrderId = oEvent.getParameter("arguments").orderId;

            var oModel = this.getView().getModel("JSONModel");
            var aOrders = oModel.getProperty("/Orders");

            // Find the selected order
            var oOrder = aOrders.find(o => o.OrderID === sOrderId);

            // Store inside JSONModel for View binding
            oModel.setProperty("/SelectedOrder", oOrder);

            // Set dynamic title
            // this.byId("orderHeader").setObjectTitle("Order " + sOrderId);
            // this.byId("orderHeader").setObjectSubtitle("Ordered By: " + oOrder.OrderBy);
        },
        onPressBackInItemDetails: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("ProductDetails");
        },
        onPressItemNumber: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("JSONModel");
            var oItem = oContext.getObject();
            debugger;
            var oView = this.getView();
            var oModel = oView.getModel("JSONModel");

            // Try to get the product id from the clicked item
            var sProductID = (oItem && (oItem.ProductID || oItem.ProductId || oItem.Id || oItem.ItemNo)) || null;

            if (!sProductID) {
                // fallback: maybe the binding context is already the product
                if (oItem && oItem.Name && oItem.Price && oItem.Vendor) {
                    oModel.setProperty("/SelectedProduct", oItem);
                } else {
                    sap.m.MessageToast.show("Product id not found on clicked row.");
                    return;
                }
            } else {
                // find the product in the Products array
                var aProducts = oModel.getProperty("/Products") || [];
                var oProduct = aProducts.find(function (p) {
                    return p.ProductID === sProductID;
                });

                if (!oProduct) {
                    sap.m.MessageToast.show("Product not found for ProductID: " + sProductID);
                    return;
                }

                // set the real product object (which contains Vendor)
                oModel.setProperty("/SelectedProduct", oProduct);
            }

            // Lazy-load popover
            if (!this._productPopover) {
                this._productPopover = sap.ui.xmlfragment("com.sap.zpurchaseorder.view.fragments.ProductDetailsPopover", this);
                this.getView().addDependent(this._productPopover);
            }

            // open the popover next to clicked ItemNo
            this._productPopover.openBy(oSource);
        }
    });
});