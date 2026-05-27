import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    },
    notificationTitle: {
        type: String,
        default: "Notification"
    },
    notificationMessage: {
        type: String,
        default: "সেরা পারফরম্যান্স ও নির্ভরযোগ্য সার্ভিসের জন্য X KING V2RAY চালান — আমাদের ভিপিএন সম্পূর্ণ অটো-আপডেট সিস্টেম।"
    },
    notificationActive: {
        type: Boolean,
        default: true
    },
    slides: {
        type: [String],
        default: [
            '/electro_slider_watch.png',
            '/slider-phone.png',
            '/splash-hand.png'
        ]
    }
}, {
    timestamps: true
});

const Download = mongoose.model('Download', downloadSchema);

export default Download;
