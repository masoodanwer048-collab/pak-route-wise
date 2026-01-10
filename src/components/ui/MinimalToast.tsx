import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinimalToastProps {
    message: string;
    className?: string;
    duration?: number;
    onClose?: () => void;
    visible?: boolean;
}

const MinimalToast = ({
    message = "Failed to load manifests",
    className,
    duration = 3000,
    onClose,
    visible = true
}: MinimalToastProps) => {
    const [isVisible, setIsVisible] = useState(visible);
    const [isMounting, setIsMounting] = useState(true);

    useEffect(() => {
        setIsVisible(visible);
        if (visible) {
            setIsMounting(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
                "flex items-center gap-3 w-[420px] h-[60px] px-5 py-4",
                "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl",
                "transition-all duration-300 ease-out",
                isMounting ? "animate-in fade-in slide-in-from-bottom-4" : "animate-out fade-out slide-out-to-bottom-2",
                className
            )}
        >
            {/* Icon */}
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-bold text-lg leading-none pt-0.5">!</span>
                    {/* Alternatively use an icon: <AlertCircle className="w-5 h-5 text-white" /> */}
                </div>
            </div>

            {/* Text */}
            <div className="flex-1 text-slate-900 font-medium text-[16px] leading-tight">
                {message}
            </div>

            {/* Close Button (Optional but nice) */}
            <button
                onClick={() => {
                    setIsVisible(false);
                    if (onClose) onClose();
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default MinimalToast;
