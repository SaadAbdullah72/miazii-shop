import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0,
    },
    comment: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    discountPrice: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    brand: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    images: {
        type: [String],
        required: true,
    },
    videoUrl: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isTrending: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// INDEXES for High-Class Speed
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isTrending: 1, isDeals: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
