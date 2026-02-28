"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminStore } from "../../../../utils/useAuthStore";

export default function ManageEnquiries() {
    const { getAllEnquiry, deleteSelectedEnquiries } = useAdminStore();

    const [enquiryList, setEnquiryList] = useState([]);
    const [loading, setLoading] = useState(true);

    // search + pagination
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

    // selection + delete modal
    const [selectedIds, setSelectedIds] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getAllEnquiry();
            setEnquiryList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Error in loadData", error);
            setEnquiryList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ✅ search filter
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return enquiryList;

        return enquiryList.filter((e) => {
            const name = (e.name || e.fullName || "").toLowerCase();
            const email = (e.email || "").toLowerCase();
            const phone = (e.phone || "").toLowerCase();
            const subject = (e.subject || "").toLowerCase();
            const message = (e.message || "").toLowerCase();

            return (
                name.includes(q) ||
                email.includes(q) ||
                phone.includes(q) ||
                subject.includes(q) ||
                message.includes(q)
            );
        });
    }, [enquiryList, search]);

    // reset page on search/pageSize change
    useEffect(() => {
        setPage(1);
    }, [search, pageSize]);

    // ✅ pagination
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);

    const paginated = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, safePage, pageSize]);

    const startItem = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const endItem = Math.min(safePage * pageSize, total);

    // ✅ selection helpers (select all on current page)
    const pageIds = paginated.map((e) => e._id).filter(Boolean);
    const allSelectedOnPage =
        pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    const toggleSelectAll = () => {
        if (allSelectedOnPage) {
            setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
        }
    };

    const toggleOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const clearSelection = () => setSelectedIds([]);

    // ✅ delete selected
    const confirmDelete = async () => {
        if (selectedIds.length === 0) return;

        try {
            setDeleting(true);

            // IMPORTANT: send array of ids
            console.log(selectedIds);

            await deleteSelectedEnquiries(selectedIds);


            setShowDeleteModal(false);
            setSelectedIds([]);
            await loadData();
        } catch (e) {
            console.log("deleteSelectedEnquiries error", e);
        } finally {
            setDeleting(false);
        }
    };

    // small page button list
    const pageButtons = useMemo(() => {
        const pages = [];
        const max = 5;
        let s = Math.max(1, safePage - 2);
        let e = Math.min(totalPages, s + max - 1);
        s = Math.max(1, e - max + 1);
        for (let i = s; i <= e; i++) pages.push(i);
        return pages;
    }, [safePage, totalPages]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Enquiries
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage enquiries: search, select, delete.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, phone, subject, message..."
                            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={5}>5 / page</option>
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                            <option value={50}>50 / page</option>
                        </select>

                        <button
                            onClick={loadData}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            Refresh
                        </button>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={selectedIds.length === 0}
                            className={`px-4 py-2 rounded-lg text-white ${selectedIds.length === 0
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            Delete Selected ({selectedIds.length})
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="text-sm text-gray-600">
                        {loading ? (
                            "Loading..."
                        ) : (
                            <>
                                Showing <span className="font-medium">{startItem}</span>–
                                <span className="font-medium">{endItem}</span> of{" "}
                                <span className="font-medium">{total}</span>
                            </>
                        )}
                    </div>

                    {selectedIds.length > 0 && (
                        <button
                            onClick={clearSelection}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Clear selection
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="text-left px-4 py-3 w-12">
                                        <input
                                            type="checkbox"
                                            checked={allSelectedOnPage}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4"
                                        />
                                    </th>
                                    <th className="text-left px-4 py-3">Name</th>
                                    <th className="text-left px-4 py-3">Email</th>
                                    <th className="text-left px-4 py-3">Phone</th>
                                    <th className="text-left px-4 py-3">Subject</th>
                                    <th className="text-left px-4 py-3">Message</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td className="px-4 py-4 text-gray-500" colSpan={6}>
                                            Loading enquiries...
                                        </td>
                                    </tr>
                                ) : paginated.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-4 text-gray-500" colSpan={6}>
                                            No enquiries found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((e, idx) => {
                                        const id = e._id;
                                        const checked = selectedIds.includes(id);
                                        const displayName = e.name || e.fullName || "-";
                                        const rowNumber = (safePage - 1) * pageSize + idx + 1;

                                        return (
                                            <tr key={id || rowNumber} className="border-t">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleOne(id)}
                                                        className="h-4 w-4"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    <div className="leading-tight">
                                                        {displayName}
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            #{rowNumber}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">{e.email || "-"}</td>
                                                <td className="px-4 py-3">{e.phone || "-"}</td>
                                                <td className="px-4 py-3">{e.subject || "-"}</td>
                                                <td className="px-4 py-3">
                                                    {e.message || "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {!loading && total > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                        <div className="text-sm text-gray-600">
                            Page <span className="font-medium">{safePage}</span> of{" "}
                            <span className="font-medium">{totalPages}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setPage(1)}
                                disabled={safePage === 1}
                                className={`px-3 py-2 rounded-lg border ${safePage === 1
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                First
                            </button>

                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className={`px-3 py-2 rounded-lg border ${safePage === 1
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                Prev
                            </button>

                            {pageButtons.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-2 rounded-lg border ${p === safePage
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                className={`px-3 py-2 rounded-lg border ${safePage === totalPages
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                Next
                            </button>

                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={safePage === totalPages}
                                className={`px-3 py-2 rounded-lg border ${safePage === totalPages
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-900">
                                Delete Enquiries
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                                disabled={deleting}
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-5 space-y-3">
                            <p className="text-gray-700">
                                You selected{" "}
                                <span className="font-semibold">{selectedIds.length}</span>{" "}
                                enquiry(s). Delete permanently?
                            </p>

                            <div className="max-h-48 overflow-auto border rounded-lg p-3 bg-gray-50">
                                <ul className="text-sm text-gray-800 space-y-1">
                                    {enquiryList
                                        .filter((x) => selectedIds.includes(x._id))
                                        .slice(0, 20)
                                        .map((x) => (
                                            <li key={x._id} className="flex justify-between gap-2">
                                                <span className="truncate">
                                                    {x.name || x.fullName || "-"} — {x.subject || "-"}
                                                </span>
                                                <span className="text-gray-500 truncate">
                                                    {x.email || ""}
                                                </span>
                                            </li>
                                        ))}
                                    {enquiryList.filter((x) => selectedIds.includes(x._id)).length >
                                        20 && <li className="text-gray-500">+ more selected...</li>}
                                </ul>
                            </div>
                        </div>

                        <div className="px-5 py-4 border-t flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={deleting || selectedIds.length === 0}
                                className={`px-4 py-2 rounded-lg text-white ${deleting
                                    ? "bg-red-300 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}