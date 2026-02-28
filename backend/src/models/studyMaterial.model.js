import mongoose from "mongoose";


const pdfSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        web_view: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);


const subCategorySchema = new mongoose.Schema(
    {
        sub_category: {
            type: String,
            required: true,
        },
        web_view: {
            type: Boolean,
            default: false,
        },
        pdfs: [pdfSchema],
    },
    { _id: false }
);


const studyMaterialSchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
        },
        web_view: {
            type: Boolean,
            default: false,
        },
        sub_categories: [subCategorySchema],
    },
    {
        timestamps: true,
    }
);


const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

export default StudyMaterial;
