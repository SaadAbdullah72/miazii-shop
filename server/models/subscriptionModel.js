import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Allow guest subscriptions for marketing if needed later
        },
        endpoint: {
            type: String,
            required: true,
            unique: true, // Prevents duplicate tokens
        },
        expirationTime: {
            type: Date,
            default: null,
        },
        keys: {
            p256dh: {
                type: String,
                required: true,
            },
            auth: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
