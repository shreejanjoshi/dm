"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFiles = void 0;
// ------------------------------------------------------------
// ------------------------------------------------------------
var addUser = function (_a) {
    var req = _a.req, data = _a.data;
    // min 6:17
    var user = req.user;
    return __assign(__assign({}, data), { user: user === null || user === void 0 ? void 0 : user.id });
};
// ------------------------------------------------------------
var yourOwnAndPurchased = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user, products, ownProductFileIds, orders, purchasedProductFileIds;
    var req = _b.req;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                user = req.user;
                // if admin you can read everything
                if ((user === null || user === void 0 ? void 0 : user.role) === "admin")
                    return [2 /*return*/, true];
                // if no user
                if (!user)
                    return [2 /*return*/, false];
                return [4 /*yield*/, req.payload.find({
                        collection: "products",
                        // when we serach for product each product is attached to user by an id and if we had depth of one it would actually fetach the entire user that is attached to this product but we we only care about the id its kind of like join in sql but we only care about id so we are only going to have depth of zero and we can get access to the results by saying the docs or by destructing the docs and calling them for example products because that what they are after all we rae searching in the product collections
                        // min 6:22
                        depth: 0,
                        // where the user that owns these products equal this user.id
                        where: {
                            user: {
                                equals: user.id,
                            },
                        },
                    })];
            case 1:
                products = (_c.sent()).docs;
                ownProductFileIds = products.map(function (prod) { return prod.product_files; }).flat();
                return [4 /*yield*/, req.payload.find({
                        collection: "orders",
                        // joins some table together give us order and users and there products
                        depth: 2,
                        where: {
                            user: {
                                equals: user.id,
                            },
                        },
                    })];
            case 2:
                orders = (_c.sent()).docs;
                purchasedProductFileIds = orders
                    .map(function (order) {
                    return order.products.map(function (product) {
                        if (typeof product === "string")
                            return req.payload.logger.error("Serach depth not sufficient to find purchased file IDs");
                        // if not string it is entire products
                        return typeof product.product_files === "string"
                            ? product.product_files
                            : product.product_files.id;
                    });
                    // takes out all the undefined values out of the array and secondly a flat which is going to turn this into a flat array so we dont have a weird array array that we cant really work with
                })
                    .filter(Boolean)
                    .flat();
                // ------------------------------------------------------------
                return [2 /*return*/, {
                        // return a query constraint where the id of the product files that we are requesting needs to be in array so we can say in pass it in array and now we want to spread in both the file ids that we own so the ...ownProductFileIds and then also the ...purchasedProductFileIds essentially constructing an array that contains both or own and the ones that we bought and we are just checking is the file that you are requesting in either of these two arrays and if it is then yes you are able to access it
                        id: {
                            in: __spreadArray(__spreadArray([], ownProductFileIds, true), purchasedProductFileIds, true),
                        },
                    }];
        }
    });
}); };
// ------------------------------------------------------------
// ------------------------------------------------------------
exports.ProductFiles = {
    slug: "product_files",
    // ------------------------------------------------------------
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
    },
    // ------------------------------------------------------------
    hooks: {
        beforeChange: [addUser],
    },
    // ------------------------------------------------------------
    access: {
        read: yourOwnAndPurchased,
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    // ------------------------------------------------------------
    upload: {
        // we can find this file under localhost../product_files
        staticURL: "/product_files",
        // this directry will be alivable under this url
        staticDir: "product_files",
        mimeTypes: ["image/*", "font/*", "application/postscript"],
    },
    // ------------------------------------------------------------
    // we have user relations but we are not setting the user anywhere when this is created that why we have to craete hook
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            admin: {
                condition: function () { return false; },
            },
            hasMany: false,
            required: true,
        },
    ],
};
