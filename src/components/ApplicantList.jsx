function ApplicantsList({ applicants, showApplicants, setShowApplicants, handleStatus }) {
  if (!showApplicants) return null;

  const STATUS_STYLES = {
    approved: "text-[#248a3d] bg-[#e8f7ed] border-[#bfe7ca]",
    rejected: "text-[#b71c1c] bg-[#fdeeee] border-[#f6c4c4]",
    pending: "text-[#8a5a00] bg-[#fff5e6] border-[#f4deba]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4" onClick={() => setShowApplicants(false)}>
      <div className="relative w-full max-w-2xl bg-white border border-black/10 rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
          <p className="text-2xl font-semibold">Applicants</p>
          <span className="text-xs text-[#6e6e73]">{applicants.length} total</span>
        </div>

        <ul className="divide-y divide-black/5 max-h-[65vh] overflow-y-auto">
          {applicants.length === 0 ? (
            <li className="py-12 text-center text-sm text-[#6e6e73]">No applicants yet</li>
          ) : (
            applicants.map((app) => (
              <li key={app.id} className="flex items-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-full bg-[#f2f7ff] border border-[#d9e9ff] flex items-center justify-center text-xs text-[#0071e3]">
                  {app.User?.username?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="flex-1 text-sm font-medium truncate">{app.User?.username}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[app.status] ?? STATUS_STYLES.pending}`}>{app.status}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleStatus(app.id, "approved")} className="h-8 px-3 rounded-full border border-[#bfe7ca] bg-[#e8f7ed] text-xs text-[#248a3d]">Approve</button>
                  <button onClick={() => handleStatus(app.id, "rejected")} className="h-8 px-3 rounded-full border border-[#f6c4c4] bg-[#fdeeee] text-xs text-[#b71c1c]">Reject</button>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="px-6 py-3.5 border-t border-black/10 flex justify-end">
          <button onClick={() => setShowApplicants(false)} className="h-9 px-4 rounded-full border border-black/10 text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantsList;
