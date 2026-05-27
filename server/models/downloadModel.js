import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Download = mongoose.model('Download', downloadSchema);

export default Download;
