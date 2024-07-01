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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
// ------------------------------------------------------------
// ------------------------------------------------------------
// we are gonna return access policy that determines can you raed this image or not
// in this function we are returing another functions
var isAdminOrHasAccessToImges = function () {
    return function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user;
        var req = _b.req;
        return __generator(this, function (_c) {
            user = req.user;
            // u cant read img
            if (!user)
                return [2 /*return*/, false];
            // u can read image
            if (user.role === "admin")
                return [2 /*return*/, true];
            // query constraint if this user owns this images if the user property of the image sthat we are accessing which is nothing else than this user field (media fields) that we are setting right here. When we create an image so if the image sfiels equals the currently logged in user then essentially its your images. So we aresaying only allow access to your images if you are looged in beacsue otherwise you should not be albe to see this at all
            // in short you can see your own images
            return [2 /*return*/, {
                    user: {
                        equals: req.user.id,
                    },
                }];
        });
    }); };
};
// ------------------------------------------------------------
// ------------------------------------------------------------
exports.Media = {
    slug: "media",
    // ------------------------------------------------------------
    hooks: {
        // invoke custom functions that we want to run
        // cms functions also provides us data we can use to execute yhese functions
        beforeChange: [
            function (_a) {
                // product image here should also be associated with directly to the user. The reason is when the user is in the back end and choosing from their existinbg media files we dont any one to be able to access all the media fiels from other people. Ex - you as the logged in user should only be the ones that you owns
                var req = _a.req, data = _a.data;
                return __assign(__assign({}, data), { user: req.user.id });
            },
        ],
    },
    // ------------------------------------------------------------
    //   i dont to see your image and you dont wanna see my image in seller dashboard
    access: {
        read: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var referer;
            var req = _b.req;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        referer = req.headers.referer;
                        // we are checking if the user is not logged in  they can read all images
                        // sell -> if u in frontend u can see all the images and if you are in backend in u cant see all images
                        if (!req.user || !(referer === null || referer === void 0 ? void 0 : referer.includes("sell"))) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, isAdminOrHasAccessToImges()({ req: req })];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
        // is same
        // delete: ({req}) => isAdminOrHasAccessToImges()({req})
        delete: isAdminOrHasAccessToImges(),
        update: isAdminOrHasAccessToImges(),
    },
    // ------------------------------------------------------------
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
    },
    // ------------------------------------------------------------
    //   min: 5:56
    upload: {
        staticURL: "/media",
        staticDir: "media",
        imageSizes: [
            {
                name: "thumbnail",
                width: 400,
                height: 300,
                position: "centre",
            },
            {
                name: "card",
                width: 768,
                height: 1024,
                position: "centre",
            },
            {
                name: "tablet",
                width: 1024,
                // calculate itself
                height: undefined,
                position: "center",
            },
        ],
        // only takes image jpg, imge png, svg but nothing else then images
        mimeTypes: ["image/*"],
    },
    // ------------------------------------------------------------
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            //   not gonna show this in admin pannel
            admin: {
                condition: function () { return false; },
            },
        },
    ],
};
