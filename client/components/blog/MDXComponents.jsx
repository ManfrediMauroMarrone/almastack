import { HTMLAttributes, DetailedHTMLProps, ImgHTMLAttributes, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { transformChildrenToString } from '../../utils/children';

// Custom Link component with enhanced styling
const CustomLink = (props) => {
    const href = props.href;
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

    if (isInternalLink) {
        return (
            <Link
                href={href}
                className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 hover:after:w-full after:transition-all after:duration-300"
                {...props}
            >
                {props.children}
            </Link>
        );
    }

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group"
            {...props}
        >
            {props.children}
            <svg
                className="inline-block w-4 h-4 ml-1 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
        </a>
    );
};

// Enhanced Image component with modern frame
const CustomImage = (props) => {
    return (
        <figure className="my-10 group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <Image
                    className="w-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    width={800}
                    height={600}
                    {...props}
                    alt={props.alt || ''}
                />
            </div>
            {props.alt && (
                <figcaption className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                    {props.alt}
                </figcaption>
            )}
        </figure>
    );
};

// Enhanced Code Block with proper formatting and copy button
const CodeBlock = ({ children, className }) => {
    const [copied, setCopied] = useState(false);
    const language = className?.replace('language-', '') || 'text';

    const copyToClipboard = () => {
        const code = transformChildrenToString(children?.props?.children || children || '');
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-8">
            {/* Language badge */}
            <div className="absolute -top-3 left-4 z-20">
                <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                    {language}
                </span>
            </div>

            {/* Copy button */}
            <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 text-xs font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Copy code"
            >
                {copied ? (
                    <span className="flex items-center gap-1 text-green-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </span>
                ) : (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                    </span>
                )}
            </button>

            {/* Code container with gradient border */}
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-[1px]">
                <div className="rounded-2xl bg-gray-950 overflow-hidden">
                    <pre className={`${className} overflow-x-auto p-6 pt-8 text-sm leading-relaxed`} style={{
                        whiteSpace: 'pre',
                        wordBreak: 'normal',
                        wordWrap: 'normal',
                        overflowWrap: 'normal'
                    }}>
                        <code className={`${className} font-mono`} style={{
                            whiteSpace: 'pre',
                            display: 'block'
                        }}>{children}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

// Modern Blockquote with gradient accent
const Blockquote = (props) => {
    return (
        <blockquote className="relative my-8 pl-6 pr-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-r-2xl border-l-4 border-gradient-to-b from-blue-500 to-purple-600" {...props}>
            <svg className="absolute -left-2 -top-2 w-8 h-8 text-blue-500/20" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <div className="relative italic text-gray-700 dark:text-gray-300">
                {props.children}
            </div>
        </blockquote>
    );
};

// Enhanced Note/Callout component with glassmorphism
const Note = ({ type = 'info', children }) => {
    const styles = {
        info: {
            bg: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
            icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            iconColor: 'text-blue-500',
            title: 'Info'
        },
        warning: {
            bg: 'from-amber-500/10 to-amber-600/10 border-amber-500/30',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
            iconColor: 'text-amber-500',
            title: 'Warning'
        },
        danger: {
            bg: 'from-red-500/10 to-red-600/10 border-red-500/30',
            icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
            iconColor: 'text-red-500',
            title: 'Danger'
        },
        success: {
            bg: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/30',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            iconColor: 'text-emerald-500',
            title: 'Success'
        },
        tip: {
            bg: 'from-purple-500/10 to-purple-600/10 border-purple-500/30',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
            iconColor: 'text-purple-500',
            title: 'Tip'
        }
    };

    const style = styles[type];

    return (
        <div className={`relative my-8 p-6 rounded-2xl bg-gradient-to-r ${style.bg} backdrop-blur-xl border border-white/10 shadow-xl`}>
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
                    <svg className={`w-6 h-6 ${style.iconColor}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={style.icon} />
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className={`font-semibold ${style.iconColor} mb-2`}>{style.title}</h4>
                    <div className="text-gray-700 dark:text-gray-300">{children}</div>
                </div>
            </div>
        </div>
    );
};

// Modern Video Embed component
const VideoEmbed = ({ src, title }) => {
    const videoId = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];

    if (videoId) {
        return (
            <div className="relative my-10 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-[1px]">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={title || 'YouTube video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                </div>
            </div>
        );
    }

    return null;
};

// Modern Table component with enhanced styling
const Table = (props) => {
    return (
        <div className="my-10 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-[1px]">
            <div className="overflow-x-auto rounded-2xl bg-white dark:bg-gray-950">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" {...props} />
            </div>
        </div>
    );
};

const THead = (props) => {
    return <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950" {...props} />;
};

const TH = (props) => {
    return (
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider" {...props} />
    );
};

const TD = (props) => {
    return (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100" {...props} />
    );
};

// Export all custom components
const MDXComponents = {
    // HTML elements
    a: CustomLink,
    img: CustomImage,
    blockquote: Blockquote,
    pre: CodeBlock,
    table: Table,
    thead: THead,
    th: TH,
    td: TD,

    // Custom components available in MDX
    Note,
    VideoEmbed,
    Image,

    // Modern headings with gradient hover effect
    h1: (props) => (
        <h1 className="relative text-5xl font-black mt-12 mb-6 text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text hover:text-transparent transition-all duration-300 group" {...props}>
            {/* <span className="absolute -left-8 text-2xl text-blue-500/30 group-hover:text-blue-500/50 transition-colors">#</span> */}
            {props.children}
        </h1>
    ),
    h2: (props) => (
        <h2 className="relative text-4xl font-bold mt-10 mb-5 text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 scroll-mt-20 group" {...props}>
            {/* <span className="absolute -left-7 text-xl text-blue-500/30 group-hover:text-blue-500/50 transition-colors">##</span> */}
            {props.children}
        </h2>
    ),
    h3: (props) => (
        <h3 className="relative text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors scroll-mt-20 group" {...props}>
            {/* <span className="absolute -left-6 text-lg text-blue-500/30 group-hover:text-blue-500/50 transition-colors">###</span> */}
            {props.children}
        </h3>
    ),
    h4: (props) => (
        <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />
    ),

    // Enhanced paragraph with better readability
    p: (props) => (
        <p className="my-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg" {...props} />
    ),

    // Modern lists with custom bullets
    ul: (props) => (
        <ul className="my-6 ml-6 space-y-3 text-gray-700 dark:text-gray-300" {...props} />
    ),
    ol: (props) => (
        <ol className="my-6 ml-6 space-y-3 text-gray-700 dark:text-gray-300" {...props} />
    ),
    li: (props) => (
        <li className="relative pl-6 before:content-['▸'] before:absolute before:left-0 before:text-blue-500 before:font-bold" {...props} />
    ),

    // Stylish horizontal rule
    hr: (props) => (
        <hr className="my-12 h-[1px] border-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" {...props} />
    ),

    // Enhanced inline code
    code: (props) => {
        const isInline = !props.className;
        if (isInline) {
            return (
                <code className="px-2 py-1 mx-1 text-sm font-mono bg-gradient-to-r from-blue-500/10 to-purple-600/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20" {...props} />
            );
        }
        return <code {...props} />;
    },
};

export default MDXComponents;