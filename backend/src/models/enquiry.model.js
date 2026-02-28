import mongoose from "mongoose"



const enquirySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        subject: { type: String, required: true },
        message: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);


const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

export default Enquiry;