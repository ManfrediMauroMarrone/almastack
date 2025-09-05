import Footer from "../Footer";
import Navbar from "../Navbar";

export default function ModernBlogLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black overflow-hidden pt-18">
            <Navbar />
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
            </div>

            {/* Main content */}
            <div className="relative z-10">
                {children}
            </div>
            <Footer />
        </div>
    );
}