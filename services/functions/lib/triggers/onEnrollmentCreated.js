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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEnrollmentWrite = void 0;
const functions = __importStar(require("firebase-functions"));
const admin_1 = require("../admin");
/**
 * Housekeeping trigger: whenever a new enrollment doc is created, stamp a
 * denormalised course title/date onto it (in case the course changes
 * later) and decrement seatsLeft once the enrollment is confirmed.
 */
exports.onEnrollmentWrite = functions.firestore
    .document("enrollments/{enrollmentId}")
    .onWrite(async (change) => {
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;
    if (!after)
        return; // deleted
    const justConfirmed = after.status === "confirmed" && before?.status !== "confirmed";
    if (justConfirmed) {
        const courseRef = admin_1.db.collection("courses").doc(after.courseSlug);
        await admin_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(courseRef);
            if (!snap.exists)
                return;
            const seatsLeft = snap.data()?.seatsLeft;
            if (typeof seatsLeft === "number")
                tx.update(courseRef, { seatsLeft: Math.max(0, seatsLeft - 1) });
        });
    }
});
//# sourceMappingURL=onEnrollmentCreated.js.map