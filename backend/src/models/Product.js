import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
    },
    { timestamps: true }
);
const productSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        category: String,
        subCategory: String,
        sizes: [String],
        bestseller: Boolean,
        featured: Boolean,
        stock: { type: Number, default: 50 },
        images: [String],
        ratingAvg: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        reviews: [reviewSchema],
    },
    { timestamps: true }
);
export default mongoose.model('Product', productSchema);
