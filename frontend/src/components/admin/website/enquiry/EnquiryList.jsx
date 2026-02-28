import { useAdminStore } from "../../../../utils/useAuthStore";
import { useEffect, useMemo, useState } from "react";

const EnquiryList = () => {
    const { getAllEnquiry } = useAdminStore();

    const [enquiryList, setEnquiryList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ✅ Search + Pagination states
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

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

    const openModal = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEnquiry(null);
    };

    // ✅ Filtered list (search over: name/email/phone/subject/message)
    const filteredEnquiries = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return enquiryList;

        return enquiryList.filter((e) => {
            const name = (e.name || "").toLowerCase();
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

    // ✅ Reset to page 1 when searching or page size changes
    useEffect(() => {
        setPage(1);
    }, [search, pageSize]);

    // ✅ Pagination calculations
    const total = filteredEnquiries.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);

    const paginatedEnquiries = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        const end = start + pageSize;
        return filteredEnquiries.slice(start, end);
    }, [filteredEnquiries, safePage, pageSize]);

    const startItem = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const endItem = Math.min(safePage * pageSize, total);

    const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

    // ✅ Page buttons (nice UX: shows current + neighbors)
    const pageButtons = useMemo(() => {
        const pages = [];
        const maxButtons = 5;
        let start = Math.max(1, safePage - 2);
        let end = Math.min(totalPages, start + maxButtons - 1);
        start = Math.max(1, end - maxButtons + 1);

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [safePage, totalPages]);

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Enquiries</h2>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    {/* Search */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, phone, subject, message..."
                        className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {/* Page size */}
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
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Info line */}
            <div className="text-sm text-gray-600 mb-3">
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3">#</th>
                                <th className="text-left px-4 py-3">Name</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Phone</th>
                                <th className="text-left px-4 py-3">Subject</th>
                                <th className="text-left px-4 py-3">Date</th>
                                <th className="text-right px-4 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className="px-4 py-4 text-gray-500" colSpan={7}>
                                        Loading enquiries...
                                    </td>
                                </tr>
                            ) : paginatedEnquiries.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-4 text-gray-500" colSpan={7}>
                                        No enquiries found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedEnquiries.map((enquiry, index) => {
                                    const displayName = enquiry.name || "-";
                                    const rowNumber = (safePage - 1) * pageSize + index + 1;

                                    return (
                                        <tr key={enquiry._id || rowNumber} className="border-t">
                                            <td className="px-4 py-3">{rowNumber}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {displayName}
                                            </td>
                                            <td className="px-4 py-3">{enquiry.email || "-"}</td>
                                            <td className="px-4 py-3">{enquiry.phone || "-"}</td>
                                            <td className="px-4 py-3">{enquiry.subject || "-"}</td>
                                            <td className="px-4 py-3">
                                                {enquiry.createdAt
                                                    ? new Date(enquiry.createdAt).toLocaleString()
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => openModal(enquiry)}
                                                    className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination bar */}
            {!loading && total > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                    <div className="text-sm text-gray-600">
                        Page <span className="font-medium">{safePage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goTo(1)}
                            disabled={safePage === 1}
                            className={`px-3 py-2 rounded-lg border ${safePage === 1
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            First
                        </button>

                        <button
                            onClick={() => goTo(safePage - 1)}
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
                                onClick={() => goTo(p)}
                                className={`px-3 py-2 rounded-lg border ${p === safePage
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => goTo(safePage + 1)}
                            disabled={safePage === totalPages}
                            className={`px-3 py-2 rounded-lg border ${safePage === totalPages
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            Next
                        </button>

                        <button
                            onClick={() => goTo(totalPages)}
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

            {/* Modal */}
            {showModal && selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-900">
                                Enquiry Details
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-5 space-y-3">
                            <div className="grid grid-cols-3 gap-3 text-sm">
                                <p className="text-gray-500">Name</p>
                                <p className="col-span-2 text-gray-900 font-medium">
                                    {selectedEnquiry.name ||

                                        "-"}
                                </p>

                                <p className="text-gray-500">Email</p>
                                <p className="col-span-2 text-gray-900">
                                    {selectedEnquiry.email || "-"}
                                </p>

                                <p className="text-gray-500">Phone</p>
                                <p className="col-span-2 text-gray-900">
                                    {selectedEnquiry.phone || "-"}
                                </p>

                                <p className="text-gray-500">Subject</p>
                                <p className="col-span-2 text-gray-900">
                                    {selectedEnquiry.subject || "-"}
                                </p>

                                <p className="text-gray-500">Date</p>
                                <p className="col-span-2 text-gray-900">
                                    {selectedEnquiry.createdAt
                                        ? new Date(selectedEnquiry.createdAt).toLocaleString()
                                        : "-"}
                                </p>
                            </div>

                            <div className="pt-2">
                                <p className="text-sm text-gray-500 mb-1">Message</p>
                                <div className="text-sm text-gray-900 bg-gray-50 border rounded-lg p-3 whitespace-pre-wrap">
                                    {selectedEnquiry.message || "-"}
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-4 border-t flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiryList;