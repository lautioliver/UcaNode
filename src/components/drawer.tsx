"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Drawer({ open, onClose, title, subtitle, children }: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col border-border bg-surface-card p-0"
        showCloseButton={false}
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          {subtitle && (
            <SheetDescription className="text-[11px] font-medium uppercase tracking-wider">
              {subtitle}
            </SheetDescription>
          )}
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-base font-semibold text-primary">{title}</SheetTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
