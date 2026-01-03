import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Copy,
    Printer,
    FileText,
    Share2,
    ShieldAlert,
    Download
} from "lucide-react";

export interface ActionItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    className?: string; // For text-red-600 etc.
    disabled?: boolean;
}

interface ActionsMenuProps {
    onEdit?: () => void;
    onView?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onPrint?: () => void;
    customActions?: ActionItem[];
    label?: string; // Optional label for the button, defaults to just icon
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
    onEdit,
    onView,
    onDelete,
    onDuplicate,
    onPrint,
    customActions = [],
    label
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 relative">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                {/* Core CRUD - Top */}
                {(onView || onEdit) && (
                    <>
                        {onView && (
                            <DropdownMenuItem onClick={onView} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                            </DropdownMenuItem>
                        )}
                        {onEdit && (
                            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4 text-orange-500" /> Edit Record
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Custom Actions - Middle */}
                {customActions.length > 0 && (
                    <>
                        {customActions.map((action, idx) => (
                            <DropdownMenuItem
                                key={idx}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={`cursor-pointer ${action.className || ''}`}
                            >
                                {action.icon && <span className="mr-2 text-gray-500">{action.icon}</span>}
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Utilities - Bottom */}
                {onDuplicate && (
                    <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                )}

                {onPrint && (
                    <DropdownMenuItem onClick={onPrint} className="cursor-pointer">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </DropdownMenuItem>
                )}

                {/* Destructive - End */}
                {onDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionsMenu;
