function DeleteAccModal({ showAccDelForm, handleAccountDelete, setShowAccDelForm }) {
  if (!showAccDelForm) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-black/10 bg-white shadow-2xl p-6">
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Delete account</h2>
        <p className="text-sm text-[#6e6e73] mt-2 mb-6">Are you sure you want to delete this account?</p>
        <div className="flex gap-3">
          <button onClick={() => setShowAccDelForm(false)} className="flex-1 h-11 rounded-full border border-black/10">Cancel</button>
          <button onClick={handleAccountDelete} className="flex-1 h-11 rounded-full bg-[#d70015] text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccModal;
