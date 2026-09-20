"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const functions = __importStar(require("firebase-functions"));
const razorpay_1 = __importDefault(require("razorpay"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = require("../admin");
const corsHandler = (0, cors_1.default)({ origin: true });
const razorpay = new razorpay_1.default({
    key_id: functions.config().razorpay?.key_id ?? process.env.RAZORPAY_KEY_ID,
    key_secret: functions.config().razorpay?.key_secret ?? process.env.RAZORPAY_KEY_SECRET,
});
/**
 * POST { enrollmentId, amount }
 * Re-reads the enrollment's course fee server-side rather than trusting
 * the client-sent amount, then creates a Razorpay order for that value.
 */
exports.createOrder = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { enrollmentId } = req.body;
            const enrollmentSnap = await admin_1.db.collection("enrollments").doc(enrollmentId).get();
            if (!enrollmentSnap.exists)
                return res.status(404).json({ error: "Enrollment not found" });
            const enrollment = enrollmentSnap.data();
            const courseSnap = await admin_1.db.collection("courses").doc(enrollment.courseSlug).get();
            const course = courseSnap.data();
            const activeFee = course?.earlyBirdFee && course?.earlyBirdDeadline && new Date() <= new Date(course.earlyBirdDeadline)
                ? course.earlyBirdFee
                : course?.fee ?? enrollment.amount;
            const order = await razorpay.orders.create({
                amount: Math.round(activeFee * 100),
                currency: "INR",
                receipt: enrollmentId,
                notes: { enrollmentId, courseSlug: enrollment.courseSlug },
            });
            res.json(order);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
});
//# sourceMappingURL=createOrder.js.map