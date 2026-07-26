import { useState, useContext, useEffect } from "react";
import Modal from "./Modal.jsx";
import Input from "./Input.jsx";
import ProfilePhotoSelector from "./ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useContext(AppContext);
    const [fullName, setFullName] = useState("");
    const [currency, setCurrency] = useState("INR");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const currencyOptions = [
        { value: "INR", label: "₹ INR (Indian Rupee)" },
        { value: "USD", label: "$ USD (US Dollar)" },
        { value: "EUR", label: "€ EUR (Euro)" },
        { value: "GBP", label: "£ GBP (British Pound)" },
        { value: "JPY", label: "¥ JPY (Japanese Yen)" }
    ];

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setCurrency(user.currency || "INR");
            setProfilePhoto(user.profileImageUrl || null);
        }
    }, [user, isOpen]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error("Full Name cannot be empty");
            return;
        }

        setIsLoading(true);

        try {
            let imageUrl = user?.profileImageUrl || "";

            if (profilePhoto && profilePhoto !== user?.profileImageUrl) {
                imageUrl = await uploadProfileImage(profilePhoto);
            } else if (!profilePhoto) {
                imageUrl = "";
            }

            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_USER_INFO, {
                fullName,
                profileImageUrl: imageUrl,
                currency
            });

            if (response.status === 200) {
                setUser(response.data);
                toast.success("Profile & currency updated successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile & Preferences">
            <form onSubmit={handleSaveProfile} className="space-y-4">
                <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />

                <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    label="Full Name"
                    placeholder="Enter your name"
                    type="text"
                />

                <Input
                    label="Preferred Currency"
                    isSelect
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={currencyOptions}
                />

                <div>
                    <label className="block text-[13px] text-slate-800 mb-1">
                        Email Address (Read-only)
                    </label>
                    <input
                        type="text"
                        disabled
                        value={user?.email || ""}
                        className="w-full text-sm bg-gray-100 text-gray-500 px-3 py-2 rounded-md border border-gray-200 cursor-not-allowed"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="add-btn add-btn-fill flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProfileModal;
