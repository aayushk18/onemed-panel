import express from "express"
import { addPdfToStudyMaterial, getAllStudyMaterials, updatePdfByDetails, updatePdfVisibility } from "../controllers/admin.controller.js";


const router = express.Router()

try {

    router.post("/academics/materials/add-pdf", addPdfToStudyMaterial);
    router.get("/academics/materials/get-pdf", getAllStudyMaterials);
    router.put("/academics/materials/update-pdf", updatePdfByDetails);
    router.put("/academics/materials/update-pdf-visibility", updatePdfVisibility);

} catch (error) {

    console.log('Error in student routing', error.message);

}

export default router;