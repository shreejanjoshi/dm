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
exports.Products = void 0;
var config_1 = require("../../config");
var stripe_1 = require("../../lib/stripe");
// ------------------------------------------------------------
// ------------------------------------------------------------
var addUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user;
    var req = _b.req, data = _b.data;
    return __generator(this, function (_c) {
        user = req.user;
        return [2 /*return*/, __assign(__assign({}, data), { user: user.id })];
    });
}); };
// ------------------------------------------------------------
// if product is created how do we know which user it belongs to
// we can tell typescript this is going to be of type after change hook so after a product is created
// after this in the user object we now have all the ids of product this user have
var syncUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var fullUser, products, allIDs_1, createdProductIDs, dataToUpdate;
    var req = _b.req, doc = _b.doc;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, req.payload.findByID({
                    collection: "users",
                    id: req.user.id,
                })];
            case 1:
                fullUser = _c.sent();
                if (!(fullUser && typeof fullUser === "object")) return [3 /*break*/, 3];
                products = fullUser.products;
                allIDs_1 = __spreadArray([], ((products === null || products === void 0 ? void 0 : products.map(function (product) {
                    return typeof product === "object" ? product.id : product;
                })) || []), true);
                createdProductIDs = allIDs_1.filter(function (id, index) { return allIDs_1.indexOf(id) === index; });
                dataToUpdate = __spreadArray(__spreadArray([], createdProductIDs, true), [doc.id], false);
                // we need to sync that with our database
                return [4 /*yield*/, req.payload.update({
                        collection: "users",
                        id: fullUser.id,
                        data: {
                            products: dataToUpdate,
                        },
                    })];
            case 2:
                // we need to sync that with our database
                _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ------------------------------------------------------------
var isAdminOrHasAccess = function () {
    return function (_a) {
        var _user = _a.req.user;
        // _user beacase so that we can say const user is equal to _user which is essentially the same thing but with tghe purpose of that we can now cast this type as our user type or undifiend if user is not logged in
        var user = _user;
        // if user is not logged in we should not be able to read any product
        if (!user)
            return false;
        // if admin we should be able to read all product
        if (user.role === "admin")
            return true;
        // if user you should only be able to read your own products
        var userProductIDs = (user.products || []).reduce(function (acc, product) {
            //  if no product
            if (!product)
                return acc;
            // product id
            if (typeof product === "string") {
                acc.push(product);
            }
            else {
                // if not string which mean this is entire obj and not just the id
                acc.push(product.id);
            }
            return acc;
        }, []);
        return {
            id: {
                in: userProductIDs,
            },
        };
    };
};
// ------------------------------------------------------------
// ------------------------------------------------------------
exports.Products = {
    // table name in lower case
    slug: "products",
    // ------------------------------------------------------------
    admin: {
        // name field that we  are going to create for default value
        useAsTitle: "name",
    },
    // ------------------------------------------------------------
    // who can access which parts of which products, can anyone download product? no right
    access: {
        // who should be able to raed product and ans is you should be ablue to read your own product and admin should be able to read products
        // yo can only read, update, delete your own product
        read: isAdminOrHasAccess(),
        update: isAdminOrHasAccess(),
        delete: isAdminOrHasAccess(),
    },
    // ------------------------------------------------------------
    // our product have a price and the strip id but we are not creating those anywhere so when we actually create that and the anwswer is when a product is created.Right away we can register it with stripe though the api and get back the stripe id assigned to this product that we can then use later on in the checkout page
    // so payload or cms provide very handy utility for that and taht is hook
    // for the hooks we get notiied we can execute our own code when a product is created for ex beforechange
    // 9:40:00
    hooks: {
        // after change hook is arry because we could add miltiple and this is going to contyain our sync user hook we have to find right above
        afterChange: [syncUser],
        // 2 things will happen when the product is inserted into our database 1st we need to add user we have the user field but we have never actually setting it. so we will create a custom function addUser at top
        beforeChange: [
            // we are adding user to the product
            addUser,
            function (args) { return __awaiter(void 0, void 0, void 0, function () {
                var data, createdProduct, updated, data, updatedProduct, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(args.operation === "create")) return [3 /*break*/, 2];
                            data = args.data;
                            return [4 /*yield*/, stripe_1.stripe.products.create({
                                    name: data.name,
                                    default_price_data: {
                                        currency: "USD",
                                        // this is gonna be price of the product in cents
                                        unit_amount: Math.round(data.price * 100),
                                    },
                                })];
                        case 1:
                            createdProduct = _a.sent();
                            updated = __assign(__assign({}, data), { stripeId: createdProduct.id, priceId: createdProduct.default_price });
                            return [2 /*return*/, updated];
                        case 2:
                            if (!(args.operation === "update")) return [3 /*break*/, 4];
                            data = args.data;
                            return [4 /*yield*/, stripe_1.stripe.products.update(data.stripeId, {
                                    name: data.name,
                                    default_price: data.priceId,
                                })];
                        case 3:
                            updatedProduct = _a.sent();
                            updated = __assign(__assign({}, data), { stripeId: updatedProduct.id, priceId: updatedProduct.default_price });
                            return [2 /*return*/, updated];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
        ],
    },
    // ------------------------------------------------------------
    fields: [
        {
            // each product has user who craete this product
            name: "user",
            // connect to user table to the product table
            type: "relationship",
            //   ti whome
            relationTo: "users",
            //   always have to have user with aproduct otherwise we could have unknown produccts and we dont know who created this
            required: true,
            //   one product cannot create by many people
            hasMany: false,
            //   going to hide this field from the admin dashboard
            admin: {
                condition: function () { return false; },
            },
        },
        // ------------------------------------------------------------
        {
            // each product will have a name
            name: "name",
            //   lable is which is visiable in admin dashboard
            label: "Name",
            type: "text",
            //   every product has to have a name
            required: true,
        },
        // ------------------------------------------------------------
        {
            name: "description",
            type: "textarea",
            label: "Product details",
        },
        // ------------------------------------------------------------
        {
            name: "price",
            label: "Price in USD",
            min: 0,
            max: 1000,
            type: "number",
            required: true,
        },
        // ------------------------------------------------------------
        {
            name: "category",
            label: "Category",
            type: "select",
            // src / config / indec.ts
            options: config_1.PRODUCT_CATEGORIES.map(function (_a) {
                var label = _a.label, value = _a.value;
                return ({ label: label, value: value });
            }),
            required: true,
        },
        // ------------------------------------------------------------
        {
            name: "product_files",
            label: "Product file(s)",
            type: "relationship",
            required: true,
            relationTo: "product_files",
            //   false => each product will have exactly one product file if you want to allow for multiple product files like for ex icon set in multiple different file formats all you have to do is change this to true
            hasMany: false,
        },
        // ------------------------------------------------------------
        {
            // need to verify from admin
            name: "approvedForSale",
            label: "Product Status",
            type: "select",
            defaultValue: "pending",
            //   only admin should change options value so we do this
            //    cms payload provides
            access: {
                // not a boolen but a function
                // regular user can only see the status
                create: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                },
                read: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                },
                update: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                },
            },
            options: [
                {
                    label: "Pending verification",
                    value: "pending",
                },
                {
                    label: "Approved",
                    value: "approved",
                },
                {
                    label: "Denied",
                    value: "denied",
                },
            ],
        },
        // ------------------------------------------------------------
        {
            // where we can handle the checkout data for payments
            name: "priceId",
            access: {
                // no admin or other user can change this only owner can
                // nothing should able to change this exect us in backend we call the get payload client were we get cms.Anywhere we do this get payload client we can overwrite these access setting by "overrideAcess: true" but alredy by default we get the payload client this will override the access fields. So no user no admin will be able to chnage this except us through code "min: 5:40"
                create: function () { return false; },
                read: function () { return false; },
                update: function () { return false; },
            },
            type: "text",
            // hidden is true beacuse we should not see it in admin pannel
            admin: {
                hidden: true,
            },
        },
        // ------------------------------------------------------------
        {
            name: "stripeId",
            access: {
                create: function () { return false; },
                read: function () { return false; },
                update: function () { return false; },
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        // ------------------------------------------------------------
        {
            name: "images",
            type: "array",
            label: "Product images",
            // min image
            minRows: 1,
            // max images
            maxRows: 4,
            required: true,
            // spell in admin dashboard
            labels: {
                singular: "Image",
                plural: "Images",
            },
            // array of umages and each field is one image
            fields: [
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                },
            ],
        },
    ],
};
