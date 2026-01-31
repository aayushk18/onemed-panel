import { useMemo, useState } from "react";
import {
    Search,
    FileText,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { medicalPdfs } from "../../../../datas/medicalPdfs.jsx";

export default function WebsiteResourcesTable() {

    const [data, setData] = useState(medicalPdfs);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const pageSize = 6;

    /* ================= TOGGLE WEB VIEW ================= */
    const toggleWebView = ({ catIdx, subIdx, pdfIdx }) => {
        setData(prev =>
            prev.map((cat, c) => {
                if (c !== catIdx) return cat;

                if (subIdx == null) {
                    return { ...cat, web_view: !cat.web_view };
                }

                return {
                    ...cat,
                    sub_categories: cat.sub_categories.map((sub, s) => {
                        if (s !== subIdx) return sub;

                        if (pdfIdx == null) {
                            return { ...sub, web_view: !sub.web_view };
                        }

                        return {
                            ...sub,
                            pdfs: sub.pdfs.map((pdf, p) =>
                                p === pdfIdx
                                    ? { ...pdf, web_view: !pdf.web_view }
                                    : pdf
                            ),
                        };
                    }),
                };
            })
        );
    };

    /* ================= FLATTEN DATA ================= */
    const flattened = useMemo(() => {
        return data.flatMap((cat, cIdx) =>
            cat.sub_categories.flatMap((sub, sIdx) =>
                sub.pdfs.map((pdf, pIdx) => ({
                    ...pdf,
                    category: cat.category_name,
                    subCategory: sub.sub_category,
                    catIdx: cIdx,
                    subIdx: sIdx,
                    pdfIdx: pIdx,
                }))
            )
        );
    }, [data]);

    /* ================= FILTER ================= */
    const filtered = flattened.filter(pdf => {
        const q = search.toLowerCase();
        return (
            (!category || pdf.category === category) &&
            (!subCategory || pdf.subCategory === subCategory) &&
            (pdf.name.toLowerCase().includes(q) ||
                pdf.category.toLowerCase().includes(q) ||
                pdf.subCategory.toLowerCase().includes(q))
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = filtered.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handleUpdate = () => {
        console.log("UPDATED DATA 👉", data);
    };

    return (
        <div className="space-y-6">

            {/* ================= FILTER BAR ================= */}
            <div className="bg-white rounded-2xl p-5 shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* CATEGORY */}
                    <div>
                        <select
                            value={category}
                            onChange={e => {
                                setCategory(e.target.value);
                                setSubCategory("");
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 rounded-xl border bg-[#F4F8FC]"
                        >
                            <option value="">Select Category</option>
                            {data.map((cat, i) => (
                                <option key={cat.category_name} value={cat.category_name}>
                                    {cat.web_view ? "✅" : "❌"} {cat.category_name}
                                </option>
                            ))}
                        </select>

                        {category && (
                            <label className="flex items-center gap-2 mt-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.find(c => c.category_name === category)?.web_view}
                                    onChange={() =>
                                        toggleWebView({
                                            catIdx: data.findIndex(c => c.category_name === category),
                                        })
                                    }
                                />
                                Show Category on Website
                            </label>
                        )}
                    </div>

                    {/* SUB CATEGORY */}
                    <div>
                        <select
                            disabled={!category}
                            value={subCategory}
                            onChange={e => {
                                setSubCategory(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 rounded-xl border bg-[#F4F8FC]"
                        >
                            <option value="">Select Sub-Category</option>
                            {category &&
                                data
                                    .find(c => c.category_name === category)
                                    ?.sub_categories.map(sub => (
                                        <option key={sub.sub_category} value={sub.sub_category}>
                                            {sub.web_view ? "✅" : "❌"} {sub.sub_category}
                                        </option>
                                    ))}
                        </select>

                        {subCategory && (
                            <label className="flex items-center gap-2 mt-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={
                                        data
                                            .find(c => c.category_name === category)
                                            ?.sub_categories.find(s => s.sub_category === subCategory)
                                            ?.web_view
                                    }
                                    onChange={() =>
                                        toggleWebView({
                                            catIdx: data.findIndex(c => c.category_name === category),
                                            subIdx: data
                                                .find(c => c.category_name === category)
                                                .sub_categories.findIndex(
                                                    s => s.sub_category === subCategory
                                                ),
                                        })
                                    }
                                />
                                Show Sub-Category on Website
                            </label>
                        )}
                    </div>

                    {/* SEARCH */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search PDFs"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-[#F4F8FC]"
                        />
                    </div>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="font-semibold text-lg">Medical PDFs</h2>

                    <button
                        onClick={() => { handleUpdate() }}
                        className="px-4 py-2 rounded-xl bg-green-600 text-white"
                    >
                        Update Changes
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="p-4">PDF</th>
                                <th className="p-4 text-center">Category</th>
                                <th className="p-4 text-center">Sub-Category</th>
                                <th className="p-4 text-center">Date</th>
                                <th className="p-4 text-center">Size</th>
                                <th className="p-4 text-center">Web View</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map(pdf => (
                                <tr key={pdf.name} className="border-t">
                                    <td className="p-4 flex gap-2">
                                        <FileText size={16} className="text-blue-600" />
                                        {pdf.name}
                                    </td>
                                    <td className="p-4 text-center">{pdf.category}</td>
                                    <td className="p-4 text-center">{pdf.subCategory}</td>
                                    <td className="p-4 text-center">{pdf.date}</td>
                                    <td className="p-4 text-center">{pdf.size}</td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={pdf.web_view}
                                            onChange={() =>
                                                toggleWebView({
                                                    catIdx: pdf.catIdx,
                                                    subIdx: pdf.subIdx,
                                                    pdfIdx: pdf.pdfIdx,
                                                })
                                            }
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <a href={pdf.link} target="_blank">
                                            <Eye size={16} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between p-4 border-t">
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>

                    <div className="flex gap-2">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                            <ChevronLeft />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
