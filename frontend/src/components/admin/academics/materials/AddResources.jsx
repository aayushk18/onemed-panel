import { useEffect, useState } from "react";
import { medicalPdfs } from "../../../../datas/medicalPdfs";
import { useAdminStore } from "../../../../utils/useAuthStore";

export default function AddResources() {
    const [categories, setCategories] = useState([]);

    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const [subCategory, setSubCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");

    const [pdf, setPdf] = useState({
        name: "",
        description: "",
        date: "",
        size: "",
        link: "",
        web_view: true,
    });

    const { addPdfResource, getPdfResources } = useAdminStore();

    useEffect(() => {
        const loadData = async () => {
            const data = await getPdfResources();

            if (Array.isArray(data) && data.length > 0) {
                setCategories(data);
                console.log(data);
            } else {

            }
        };

        loadData();
    }, []);




    const selectedCategory = categories.find(
        c => c.category_name === category
    );

    const handleSubmit = async (e) => {

        e.preventDefault();

        // if (!category || !subCategory) {
        //     alert("Please fill all the fields");
        //     return;
        // }

        const payload = {
            category_name: newCategory || category,
            sub_category: newSubCategory || subCategory,
            pdf,
        };
        console.log(payload);

        await addPdfResource(payload);




        alert("PDF Added Successfully ✅");
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">
                Add Study Material PDF
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* 🔹 Category */}
                <div>
                    <label className="block font-medium mb-1">Category</label>
                    <select
                        value={category}
                        onChange={e => {
                            setCategory(e.target.value);
                            setSubCategory("");
                        }}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.category_name}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Or add new category"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="mt-2 w-full border rounded p-2"
                    />
                </div>

                {/* 🔹 Sub Category */}
                <div>
                    <label className="block font-medium mb-1">Sub Category</label>
                    <select
                        value={subCategory}
                        onChange={e => setSubCategory(e.target.value)}
                        className="w-full border rounded p-2"
                        disabled={!selectedCategory}
                    >
                        <option value="">Select Sub Category</option>
                        {selectedCategory?.sub_categories.map(sub => (
                            <option key={sub.sub_category} value={sub.sub_category}>
                                {sub.sub_category}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Or add new sub category"
                        value={newSubCategory}
                        onChange={e => setNewSubCategory(e.target.value)}
                        className="mt-2 w-full border rounded p-2"
                    />
                </div>

                {/* 🔹 PDF Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        placeholder="PDF Name"
                        className="border p-2 rounded"
                        required
                        onChange={e => setPdf({ ...pdf, name: e.target.value })}
                    />
                    <input
                        placeholder="PDF Size (e.g. 2.3 MB)"
                        className="border p-2 rounded"
                        onChange={e => setPdf({ ...pdf, size: e.target.value })}
                    />
                    <input
                        type="date"
                        className="border p-2 rounded"
                        onChange={e => setPdf({ ...pdf, date: e.target.value })}
                    />
                    <input
                        placeholder="PDF Link"
                        className="border p-2 rounded"
                        required
                        onChange={e => setPdf({ ...pdf, link: e.target.value })}
                    />
                </div>

                <textarea
                    placeholder="PDF Description"
                    className="w-full border p-2 rounded"
                    rows={3}
                    onChange={e => setPdf({ ...pdf, description: e.target.value })}
                />

                {/* 🔹 Visibility */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={pdf.web_view}
                        onChange={e => setPdf({ ...pdf, web_view: e.target.checked })}
                    />
                    Show on Website
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add PDF
                </button>
            </form>
        </div>
    );
}
