'use client';

import Link from "next/link";
import Logo from "./Logo";

const Footer = ({ translate }) => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <Logo />
                        <p className="text-gray-400 mt-4">
                            {translate.footer.tagline}
                        </p>
                    </div>

                    <div className="flex gap-6 text-gray-400">
                        <Link href="/privacy-policy" replace className="hover:text-white transition-colors">{translate.footer.privacy}</Link>
                    </div>
                    <div>
                        <a className="text-xs text-gray-400" href="https://www.vecteezy.com/free-vector/server">Server Vectors by Vecteezy</a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} {translate.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;