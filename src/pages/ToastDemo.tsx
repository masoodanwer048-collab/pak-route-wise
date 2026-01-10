import { useState } from "react";
import MinimalToast from "@/components/ui/MinimalToast";
import { Button } from "@/components/ui/button";

const ToastDemo = () => {
    const [showToast, setShowToast] = useState(false);

    return (
        <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center gap-6">
            <h1 className="text-2xl font-bold text-slate-800">Custom Toast Component Demo</h1>
            <p className="text-slate-500 max-w-md text-center">
                Click the button below to trigger the custom minimal error toast designed to your specifications.
            </p>

            <Button
                onClick={() => setShowToast(true)}
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 text-lg"
            >
                Trigger Error Toast
            </Button>

            {/* In a real app, this might be managed by a global context, but here we conditionally render it */}
            {showToast && (
                <MinimalToast
                    message="Failed to load manifests"
                    onClose={() => setShowToast(false)}
                    visible={showToast}
                />
            )}
        </div>
    );
};

export default ToastDemo;
