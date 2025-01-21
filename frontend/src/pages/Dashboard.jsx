import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      axios.get('/profile', { withCredentials: true })
        .then(({ data }) => setUser(data))
        .catch((err) => console.log('Error fetching dashboard data', err));
    }
  }, [user, setUser]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a photo to upload as profile pic.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token") || ""; 

      const { data } = await axios.post(
        "/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true, 
        }
      );

      toast.success("Profile picture uploaded successfully!");
      setUser((prevUser) => ({
        ...prevUser,
        profilePic: data.url,
      }));
    } catch (error) {
      console.error("Error uploading profile picture", error);
      toast.error("Failed to upload profile picture");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleLogout = () => {
    axios.post('/logout', {}, { withCredentials: true })
      .then(() => {
        toast.success("Logged out successfully!");
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error logging out", err);
        toast.error("Failed to log out");
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-3xl relative transition-shadow duration-300 transform hover:scale-105">
        <div className="absolute top-4 left-4 flex items-center">
          {user?.profilePic && (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-16 h-16 sm:w-12 sm:h-12 rounded-full border-4 border-gray-200 object-cover shadow-md"
            />
          )}
          <h1 className="text-3xl font-semibold text-blue-700 ml-4">Welcome to Your Dashboard</h1>
        </div>

        {user ? (
          <div className="mt-12 text-center">
            <h2 className="text-2xl mb-6 text-gray-800 font-medium">Hello, {user.name}</h2>
            {!user.profilePic && (
              <form
                onSubmit={handleUpload}
                className="flex justify-center items-center space-x-4 mb-8"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-10 py-4 rounded-lg font-medium hover:bg-blue-800 transition duration-300"
                >
                  Upload Profile Picture
                </button>
              </form>
            )}
            <button 
              onClick={handleLogout} 
              className="absolute top-4 right-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-800 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center text-red-500">User not found</div>
        )}
      </div>
    </div>
  );
}