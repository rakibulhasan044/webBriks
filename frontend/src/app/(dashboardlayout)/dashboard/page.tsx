export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here is an overview of your workspaces.</p>
      </div>
      
      {/* Placeholder for dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-2">Total Boards</h3>
          <p className="text-3xl font-bold text-slate-900">3</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold text-slate-900">12</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-2">Team Members</h3>
          <p className="text-3xl font-bold text-slate-900">5</p>
        </div>
      </div>
    </div>
  );
}
