"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryStatus = exports.OrderStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MEMBER"] = "MEMBER";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus["AVAILABLE"] = "AVAILABLE";
    InventoryStatus["RESERVED"] = "RESERVED";
    InventoryStatus["SOLD"] = "SOLD";
    InventoryStatus["DAMAGED"] = "DAMAGED";
    InventoryStatus["RETURNED"] = "RETURNED";
})(InventoryStatus || (exports.InventoryStatus = InventoryStatus = {}));
//# sourceMappingURL=index.js.map