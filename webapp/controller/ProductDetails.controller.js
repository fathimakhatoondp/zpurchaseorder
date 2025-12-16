sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.sap.zpurchaseorder.controller.ProductDetails", {
        onInit() {

        },

        onListPress: function (oEvent) {
            debugger;

            var oModel = this.getView().getModel("JSONModel");

            // Get selected product
            var sPath = oEvent.getParameter("listItem").getBindingContext("JSONModel").getPath();
            var oProduct = oModel.getProperty(sPath);
            var sSelectedProductID = oProduct.ProductID;

            // Get all orders
            var aAllOrders = oModel.getProperty("/Orders");

            // Filter orders where Items[] contains the selected product ID
            var aFiltered = aAllOrders.filter(order =>
                order.Items.some(item => item.ProductID === sSelectedProductID)
            ).map(order => {
                // find the matching item for this product
                var oMatchedItem = order.Items.find(item => item.ProductID === sSelectedProductID);

                return {
                    OrderID: order.OrderID,
                    OrderDate: order.OrderDate,
                    OrderBy: order.OrderBy,
                    ProductID: oMatchedItem.ProductID,
                    Quantity: oMatchedItem.Quantity
                };
            });
            // Update the model
            oModel.setProperty("/SelectedProduct", oProduct);
            oModel.setProperty("/FilteredOrders", aFiltered);
            oModel.setProperty("/SelectedProductID", sSelectedProductID);
            this.byId("splitAppId").toDetail(this.byId("detailsProductsPageId"));
            this.getView().byId("detailsProductsPageId").setTitle("Orders for Product '" + oProduct.Name + "'");
        },
        onPressTableRow: function (oEvent) {
            debugger;
            var oRow = oEvent.getSource().getBindingContext("JSONModel").getObject();
            var sOrderID = oRow.OrderID;

            var oModel = this.getView().getModel("JSONModel");
            var aOrders = oModel.getProperty("/Orders");
            var aProducts = oModel.getProperty("/Products");

            // full order object
            var oOrder = aOrders.find(o => o.OrderID === sOrderID);

            // merge
            var aMerged = oOrder.Items.map(item => {
                var p = aProducts.find(prod => prod.ProductID === item.ProductID);
                return {
                    ProductID: item.ProductID,
                    Quantity: item.Quantity,
                    ItemNo: p.ItemNo,
                    Name: p.Name,
                    Description: p.Description,
                    Price: p.Price,
                    Currency: p.Currency,
                    VendorName: p.VendorName,
                    VendorRating: p.VendorRating,
                    Total: item.Quantity * Number(p.Price)
                };
            });
            //Calculate order total 
            var iOrderTotal = aMerged.reduce((sum, item) => sum + item.Total, 0);
            // Set to model
            oModel.setProperty("/SelectedOrder", oOrder);
            oModel.setProperty("/SelectedOrderItemsMerged", aMerged);
            oModel.setProperty("/SelectedOrderTotal", iOrderTotal);
            oModel.refresh(true);
            this.getOwnerComponent().getRouter().navTo("ItemDetails", {
                orderId: oOrder.OrderID
            });
        }
    });
});