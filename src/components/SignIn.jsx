import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Cloud, LogIn } from "lucide-react";

function SignIn(){
  const { darkMode } = false;
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"
      }`}
    >
      <div
        className={`max-w-md w-full mx-4 ${
          darkMode ? "bg-slate-800" : "bg-white"
        } rounded-2xl shadow-xl p-8`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                darkMode ? "bg-slate-700" : "bg-sky-100"
              }`}
            >
              <Cloud
                className={`w-8 h-8 ${
                  darkMode ? "text-blue-400" : "text-sky-500"
                }`}
              />
            </div>
          </div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Welcome to SkyBlogs
          </h1>
          <p
            className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
          >
            Sign in to bookmark your favorite articles
          </p>
        </div>

        {/* Features */}
        <div
          className={`mb-8 space-y-3 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-3 ${
                darkMode ? "bg-blue-400" : "bg-sky-500"
              }`}
            ></div>
            <span>Bookmark articles to read later</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-3 ${
                darkMode ? "bg-blue-400" : "bg-sky-500"
              }`}
            ></div>
            <span>Browse fresh content updated hourly</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-3 ${
                darkMode ? "bg-blue-400" : "bg-sky-500"
              }`}
            ></div>
            <span>Search and filter through all articles</span>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
            darkMode
              ? "bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl"
              : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl border border-gray-200"
          }`}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>

        {/* Guest Access Note */}
        <div
          className={`mt-6 text-center text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <p>
            You can browse articles as a guest, but sign in is required to
            bookmark articles.
          </p>
        </div>

        {/* Continue as Guest */}
        <button
          onClick={() => navigate("/")}
          className={`w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
            darkMode
              ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Continue as Guest</span>
        </button>
      </div>
    </div>
  );

}

export default SignIn;


