import { Users, GraduationCap, ClipboardCheck } from "lucide-react";

const stats = [
  { title: "Total Students", value: "1,240", icon: Users },
  { title: "Faculty Members", value: "86", icon: GraduationCap },
  { title: "Admissions Today", value: "24", icon: ClipboardCheck },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6
            shadow-[0_10px_25px_rgba(0,0,0,0.06)]
            hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]
            transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {value}
                </h2>
              </div>

              <div className="p-3 rounded-xl bg-[#E8F0FE] text-blue-600">
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
