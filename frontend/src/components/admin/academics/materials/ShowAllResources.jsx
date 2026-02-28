import { useEffect, useMemo, useState } from "react";
import {
    Search,
    FileText,
    Eye,
    ChevronLeft,
    ChevronRight,
    Plus,
    Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../../../utils/useAuthStore";





const ShowAllResources = () => {

    const { getPdfResources, updatePdfResource } = useAdminStore();






    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [medicalPdfs, setMedicalPdfs] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPdf, setEditingPdf] = useState(null);


    const pageSize = 6;

    /* 🔹 Flatten PDFs */
    const flattenedPdfs = useMemo(() => {
        if (!Array.isArray(medicalPdfs)) return [];

        return medicalPdfs.flatMap((cat) =>
            cat.sub_categories?.flatMap((sub) =>
                sub.pdfs?.map((pdf) => ({
                    ...pdf,
                    category: cat.category_name,
                    subCategory: sub.sub_category,
                })) || []
            ) || []
        );
    }, [medicalPdfs]);

    const handleUpdatePdf = async () => {
        try {
            await updatePdfResource(editingPdf);


            setMedicalPdfs((prev) =>
                prev.map((cat) => ({
                    ...cat,
                    sub_categories: cat.sub_categories.map((sub) => ({
                        ...sub,
                        pdfs: sub.pdfs.map((p) =>
                            p.link === editingPdf.link ? editingPdf : p
                        ),
                    })),
                }))
            );

            setIsEditOpen(false);
        } catch (err) {
            console.error(err);
        }
    };




    useEffect(() => {
        const loadData = async () => {
            const data = await getPdfResources();

            if (Array.isArray(data) && data.length > 0) {
                setMedicalPdfs(data);
            } else {
                setMedicalPdfs(Pdfs);
            }
        };

        loadData();
    }, []);





    /* 🔹 Filter */
    const filteredData = useMemo(() => {
        const q = search.toLowerCase();

        return flattenedPdfs.filter((pdf) => {
            return (
                (!category || pdf.category === category) &&
                (!subCategory || pdf.subCategory === subCategory) &&
                (pdf.name.toLowerCase().includes(q) ||
                    pdf.category.toLowerCase().includes(q) ||
                    pdf.subCategory.toLowerCase().includes(q))
            );
        });
    }, [category, subCategory, search, flattenedPdfs]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );



    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setSubCategory("");
                            setPage(1);
                        }}
                        className="px-4 py-2 rounded-xl border bg-[#F4F8FC] focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Select Category</option>
                        {medicalPdfs.map((cat) => (
                            <option key={cat.category_name}>{cat.category_name}</option>
                        ))}
                    </select>

                    <select
                        value={subCategory}
                        disabled={!category}
                        onChange={(e) => {
                            setSubCategory(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 rounded-xl border bg-[#F4F8FC] focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
                    >
                        <option value="">Select Sub-Category</option>
                        {category &&
                            medicalPdfs
                                .find((c) => c.category_name === category)
                                ?.sub_categories.map((sub) => (
                                    <option key={sub.sub_category}>
                                        {sub.sub_category}
                                    </option>
                                ))}
                    </select>

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-2.5 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search PDFs"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-[#F4F8FC] focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* ================= TABLE CARD ================= */}
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Medical PDFs
                    </h2>

                    <Link to="/admin/academics/materials/add-materials" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                        <Plus size={18} />
                        Add PDF
                    </Link>
                </div>

                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-[#E8F0FE] text-gray-700">
                            <tr>
                                <th className="p-4 text-left">S.No</th>
                                <th className="p-4 text-left">PDF</th>
                                <th className="p-4 text-center">Category</th>
                                <th className="p-4 text-center">Sub-Category</th>
                                <th className="p-4 text-center">Date</th>
                                <th className="p-4 text-center">Size</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((pdf, idx) => (
                                <tr
                                    key={idx}
                                    className="border-t hover:bg-[#F4F8FC]"
                                >
                                    <td className="p-4">
                                        {(page - 1) * pageSize + idx + 1}
                                    </td>

                                    <td className="p-4 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-600" />
                                        <div>
                                            <p className="font-medium">{pdf.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {pdf.description}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">{pdf.category}</td>
                                    <td className="p-4 text-center">{pdf.subCategory}</td>
                                    <td className="p-4 text-center">{pdf.date}</td>
                                    <td className="p-4 text-center">{pdf.size}</td>


                                    <td className="p-4 flex items-center gap-2 text-center">
                                        <a
                                            href={pdf.link}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        >
                                            <Eye size={14} />
                                            View
                                        </a>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setEditingPdf(pdf);
                                                setIsEditOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isEditOpen && editingPdf && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4">Edit PDF</h2>

                            <div className="space-y-3">
                                <input
                                    className="w-full border rounded p-2"
                                    value={editingPdf.name}
                                    onChange={(e) =>
                                        setEditingPdf({ ...editingPdf, name: e.target.value })
                                    }
                                    placeholder="PDF Name"
                                />

                                <textarea
                                    className="w-full border rounded p-2"
                                    value={editingPdf.description}
                                    onChange={(e) =>
                                        setEditingPdf({ ...editingPdf, description: e.target.value })
                                    }
                                    placeholder="Description"
                                />

                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={editingPdf.date}
                                    onChange={(e) =>
                                        setEditingPdf({ ...editingPdf, date: e.target.value })
                                    }
                                />

                                <input
                                    className="w-full border rounded p-2"
                                    value={editingPdf.size}
                                    onChange={(e) =>
                                        setEditingPdf({ ...editingPdf, size: e.target.value })
                                    }
                                    placeholder="Size (e.g. 2.3 MB)"
                                />

                                <input
                                    className="w-full border rounded p-2"
                                    value={editingPdf.link}
                                    onChange={(e) =>
                                        setEditingPdf({ ...editingPdf, link: e.target.value })
                                    }
                                    placeholder="PDF Link"
                                />

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editingPdf.web_view}
                                        onChange={(e) =>
                                            setEditingPdf({
                                                ...editingPdf,
                                                web_view: e.target.checked,
                                            })
                                        }
                                    />
                                    Show on Website
                                </label>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 rounded-lg border"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleUpdatePdf}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ================= MOBILE SLIDER ================= */}
                <div className="md:hidden">
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4">
                        {paginatedData.map((pdf, idx) => (
                            <div
                                key={idx}
                                className="min-w-[85%] snap-center bg-white rounded-2xl p-5
                shadow-[0_8px_25px_rgba(0,0,0,0.08)]
                border border-blue-100"
                            >
                                <div className="flex gap-3 mb-3">
                                    <div className="p-2 rounded-xl bg-blue-100">
                                        <FileText className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {pdf.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {pdf.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                                    <div>
                                        <span className="font-medium">Category</span>
                                        <p>{pdf.category}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Sub-Category</span>
                                        <p>{pdf.subCategory}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Date</span>
                                        <p>{pdf.date}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Size</span>
                                        <p>{pdf.size}</p>
                                    </div>
                                </div>

                                <a
                                    href={pdf.link}
                                    target="_blank"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                >
                                    <Eye size={16} />
                                    View PDF
                                </a>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-gray-400 pb-4">
                        Swipe left / right to view PDFs →
                    </p>
                </div>

                {/* ================= PAGINATION ================= */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>

                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="p-2 rounded-lg border disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="p-2 rounded-lg border disabled:opacity-40"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowAllResources;


