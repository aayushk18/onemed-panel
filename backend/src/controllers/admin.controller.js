import mongoose from "mongoose";
import Enquiry from "../models/enquiry.model.js";
import StudyMaterial from "../models/studyMaterial.model.js";




export const addPdfToStudyMaterial = async (req, res) => {
    try {
        const { category_name, sub_category, pdf } = req.body;

        if (!category_name || !sub_category || !pdf) {
            return res.status(400).json({
                message: "Category, sub-category and pdf data are required",
            });
        }

        let category = await StudyMaterial.findOne({ category_name });

        if (!category) {
            category = await StudyMaterial.create({
                category_name,
                web_view: true,
                sub_categories: [
                    {
                        sub_category,
                        web_view: true,
                        pdfs: [pdf],
                    },
                ],
            });

            return res.status(201).json({
                message: "Category, Sub-category & PDF created successfully",
                data: category,
            });
        }

        const subCatIndex = category.sub_categories.findIndex(
            (sub) => sub.sub_category === sub_category
        );

        if (subCatIndex === -1) {
            category.sub_categories.push({
                sub_category,
                web_view: true,
                pdfs: [pdf],
            });

            await category.save();

            return res.status(201).json({
                message: "Sub-category created and PDF added successfully",
                data: category,
            });
        }


        category.sub_categories[subCatIndex].pdfs.push(pdf);
        await category.save();

        return res.status(200).json({
            message: "PDF added successfully",
            data: category,
        });

    } catch (error) {
        console.error("Add PDF Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};


export const getAllStudyMaterials = async (req, res) => {
    try {
        const data = await StudyMaterial.find().sort({ createdAt: -1 });




        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        console.error("Fetch Study Material Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch study materials",
        });
    }
};


export const updatePdfByDetails = async (req, res) => {
    try {
        const {
            category,
            subCategory,
            name,
            description,
            date,
            size,
            link,
            web_view,
        } = req.body;

        console.log("req.body", req.body);


        if (!category || !subCategory || !name || !size || !link) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const sourceDoc = await StudyMaterial.findOne({
            "sub_categories.pdfs": {
                $elemMatch: { name, size, link },
            },
        });

        if (!sourceDoc) {
            return res.status(404).json({ message: "PDF not found" });
        }

        let removedPdf = null;

        for (const sub of sourceDoc.sub_categories) {
            const index = sub.pdfs.findIndex(
                (p) => p.name === name && p.size === size && p.link === link
            );

            if (index !== -1) {
                removedPdf = sub.pdfs[index];
                sub.pdfs.splice(index, 1);
                break;
            }
        }

        if (!removedPdf) {
            return res.status(404).json({ message: "PDF not found" });
        }

        await sourceDoc.save();

        let targetCategory = await StudyMaterial.findOne({
            category_name: category,
        });

        if (!targetCategory) {
            targetCategory = await StudyMaterial.create({
                category_name: category,
                web_view: true, // default
                sub_categories: [],
            });
        }

        let targetSub = targetCategory.sub_categories.find(
            (s) => s.sub_category === subCategory
        );

        if (!targetSub) {
            targetCategory.sub_categories.push({
                sub_category: subCategory,
                web_view: true, // default
                pdfs: [],
            });
            targetSub =
                targetCategory.sub_categories[targetCategory.sub_categories.length - 1];
        }

        targetSub.pdfs.push({
            name,
            description,
            date,
            size,
            link,
            web_view,
        });

        await targetCategory.save();

        res.status(200).json({
            success: true,
            message: "PDF updated successfully",
        });
    } catch (error) {
        console.error("Update PDF Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const updatePdfVisibility = async (req, res) => {
    try {
        const dataArray = req.body;

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        const bulkOperations = dataArray.map((item) => ({
            updateOne: {
                filter: { _id: item._id },
                update: {
                    $set: {
                        web_view: item.web_view,
                        sub_categories: item.sub_categories
                    }
                }
            }
        }));

        const result = await StudyMaterial.bulkWrite(bulkOperations);

        res.status(200).json({
            success: true,
            message: "PDF visibility updated successfully",
            result
        });

    } catch (error) {
        console.error("Update PDF Visibility Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getEnquiry = async (req, res) => {
    try {
        const data = await Enquiry.find().sort();

        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        console.error("Fetch Enquiry Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enquiry",
        });
    }
};


export const deleteEnquiry = async (req, res) => {
    try {
        const { ids } = req.body;


        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ids must be a non-empty array",
            });
        }

        // remove duplicates + ensure strings
        const uniqueIds = [...new Set(ids)].map(String);

        // validate ObjectIds
        const invalidIds = uniqueIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid id(s)",
                invalidIds,
            });
        }

        const result = await Enquiry.deleteMany({ _id: { $in: uniqueIds } });

        return res.status(200).json({
            success: true,
            message: "Enquiries deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Delete Enquiry Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};