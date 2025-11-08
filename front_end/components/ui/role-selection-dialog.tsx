"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Users, Truck, X } from "lucide-react";

interface RoleSelectionDialogProps {
  children: React.ReactNode;
}

export function RoleSelectionDialog({ children }: RoleSelectionDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const roles = [
    {
      id: "owner",
      title: "Business Owner",
      description: "Manage your business operations and staff",
      icon: Store,
      route: "/signin/owner",
    },
    {
      id: "affiliate",
      title: "Affiliate",
      description: "Access your affiliate dashboard and commissions",
      icon: Users,
      route: "/signin/affiliate",
    },
    {
      id: "supplier",
      title: "Supplier",
      description: "Manage your supply chain and inventory",
      icon: Truck,
      route: "/dashboard/supplier-status",
    },
  ];

  const handleRoleSelect = (route: string) => {
    setOpen(false);
    router.push(route);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg text-gray-900">Choose Your Role</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 text-sm">{role.title}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleRoleSelect(role.route)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                >
                  Sign In
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}