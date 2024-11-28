"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.superAdminMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const superAdminMiddleware = (req, res, next) => {
    var _a;
    const passcode = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!passcode) {
        res.status(401).json({ message: "Unauthorized." });
        return;
    }
    try {
        if (passcode !== process.env.SUPERADMIN_PASSCODE) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
};
exports.superAdminMiddleware = superAdminMiddleware;
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const adminFound = yield Admin_1.default.findById(decoded.id);
        if (!adminFound) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
});
exports.verifyAdmin = verifyAdmin;