
interface ResetZoomButtonProps {
  onReset: () => void;
  isDarkMode?: boolean;
}

const ResetZoomButton = ({ onReset, isDarkMode = false } : ResetZoomButtonProps) => {
    return (
        <div className="absolute top-3 right-2.5 z-50">
            <button
                onClick={onReset}
                className={`w-7 h-7 flex items-center justify-center shadow-md transition-colors ${
                isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Reset map view"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M21 3v5h-5"></path>
                    <path d="M3 21v-5h5"></path>
                    <path d="M18 14a8 8 0 0 1-14.93 3"></path>
                    <path d="M6 10a8 8 0 0 1 14.93-3"></path>
                </svg>
            </button>
        </div>
    );
};

export default ResetZoomButton;