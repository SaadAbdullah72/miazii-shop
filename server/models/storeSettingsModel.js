import mongoose from 'mongoose';

// Singleton model — only ONE settings document in the whole DB (upserted via findOneAndUpdate)
const storeSettingsSchema = new mongoose.Schema({
    // Manual Payment Numbers
    paymentPersonalNumber: {
        type: String,
        default: '+880 1612-893871',
    },
    paymentAgentNumber: {
        type: String,
        default: '+880 1905-507895',
    },
    paymentAgentLabel: {
        type: String,
        default: 'Agent (Rocket Available Here)',
    },
    paymentAgentNote: {
        type: String,
        default: 'Rocket: Use this number only',
    },
    paymentVerificationTime: {
        type: String,
        default: '15–30 minutes',
    },

    // Store Info (extendable later)
    storeName: {
        type: String,
        default: 'Miazi Shop',
    },
    supportEmail: {
        type: String,
        default: '',
    },
    supportPhone: {
        type: String,
        default: '+880 1612-893871',
    },
}, {
    timestamps: true,
});

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;
