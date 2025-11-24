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
import { Users, Package, Store } from "lucide-react";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";

interface TrialDialogProps {
  children: React.ReactNode;
}

export function TrialDialog({ children }: TrialDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const router = useRouter();

  const userTypes = [
    {
      id: "owner",
      title: "Bussiness Owner",
      description: "Manage your bussiness operations",
      icon: Store,
      route: "/register/owner",
    },
    {
      id: "supplier",
      title: "Supplier",
      description: "Supply products to pharmacies",
      icon: Package,
      route: "/register/supplier",
    },
    {
      id: "affiliate",
      title: "Affiliate",
      description: "Earn commissions by referring",
      icon: Users,
      route: "/register/affiliate",
    },
  ];

  const handleSubmit = () => {
    const selectedUserType = userTypes.find((type) => type.id === selectedType);
    if (selectedUserType) {
      // Show coming soon dialog for supplier
      if (selectedType === "supplier") {
        setOpen(false);
        setTimeout(() => setComingSoonOpen(true), 100);
      } else {
        router.push(selectedUserType.route);
        setOpen(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-sm bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-black text-center text-md">
              Choose Your Role
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <div>
              {userTypes.map((type) => (
                <div
                  key={type.id}
                  className={`cursor-pointer transition-all ${selectedType === type.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                    }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="my-2">
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div
                        className={`p-1.5 rounded-lg ${selectedType === type.id
                            ? "bg-emerald-100"
                            : "bg-gray-100"
                          }`}
                      >
                        <type.icon
                          className={`w-4 h-4 ${selectedType === type.id
                              ? "text-emerald-600"
                              : "text-gray-600"
                            }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-black text-sm">
                          {type.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-sm"
                onClick={handleSubmit}
                disabled={!selectedType}
              >
                Start Trial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ComingSoonDialog
        open={comingSoonOpen}
        onOpenChange={setComingSoonOpen}
        title="Supplier Registration Coming Soon"
        description="We're working hard to bring you the supplier registration feature. This will allow suppliers to join our platform and connect with business owners. Stay tuned for updates!"
      />
    </>
  );
}
