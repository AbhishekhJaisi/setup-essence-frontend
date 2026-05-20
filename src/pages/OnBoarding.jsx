import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OnBoarding() {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    phone_number: "",
    Country: "",
    City: "",
    Interests: "",
    Bio: "",
    DOB: "",
    Address: "",
  });
  const [userinfo, setUserInfo] = useState({});
  const [errors, setErrors] = useState({});
  const [formerror, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);
  console.log("USERINFO:", userinfo);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const newErrors = {};

      Object.entries(formData).forEach(([key, value]) => {
        if (!value) {
          newErrors[key] = true;
        }
      });

      const payload = {
        phone_number: formData.phone_number,
        dob: formData.DOB,
        country: formData.Country,
        city: formData.City,
        address: formData.Address,
        interests: formData.Interests,
        bio: formData.Bio,
      };

      const res = await fetch(`${apiUrl}/auth/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Error:", data);
        setFormError(data.message || "Something went wrong");
        return;
      } else {
        navigate("/profile");
      }

      console.log("Success:", data);
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Complete Your Profile
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Welcome! Please complete your profile to get the best
                experience.
              </p>
            </div>
          </div>
        </div>
      </header>
      <form
        onSubmit={handleSubmit}
        className="p-6 overflow-y-auto max-h-[80vh]"
      >
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  name="Name"
                  type="text"
                  placeholder={userinfo?.user?.username || "Name"}
                  value={formData.Name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                    focus:ring-gray-500 focus:border-transparent transition ${errors.Name ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Profile Picture
                </label>
                <input
                  name="ProfilePicture"
                  type="file"
                  accept="image/*"
                  placeholder="Profile Picture"
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 transition  ${errors.Address ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>*/}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  name="Email"
                  type="email"
                  placeholder={userinfo?.user?.email || "Email"}
                  onChange={handleChange}
                  value={formData.Email}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                       focus:ring-gray-500 focus:border-transparent transition ${errors.Email ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  type="text"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  value={formData.phone_number}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                       focus:ring-gray-500 focus:border-transparent transition ${errors.phone ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                DOB
              </label>
              <input
                name="DOB"
                type="date"
                onChange={handleChange}
                value={formData.DOB}
                className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                     focus:ring-gray-500 focus:border-transparent transition ${errors.DOB ? "border-red-500 scale-103" : "border-slate-300"}`}
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Country
                </label>
                <input
                  name="Country"
                  type="text"
                  placeholder="Country"
                  onChange={handleChange}
                  value={formData.Country}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                       focus:ring-gray-500 transition ${errors.Country ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <input
                  name="City"
                  type="text"
                  placeholder="City"
                  onChange={handleChange}
                  value={formData.City}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                       focus:ring-gray-500 focus:border-transparent transition ${errors.City ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <textarea
                  name="Address"
                  placeholder="Address"
                  onChange={handleChange}
                  value={formData.Address}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2
                     focus:ring-gray-500 focus:border-transparent transition ${errors.Address ? "border-red-500 scale-103" : "border-slate-300"}`}
                />
              </div>
            </div>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
          {formerror && (
            <p className="text-sm text-red-500 mb-4 text-center font-medium ">
              {formerror}
            </p>
          )}
          <div className="flex flex-col-reverse md:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-700 shadow-lg shadow-indigo-200 transition active:scale-95 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default OnBoarding;
