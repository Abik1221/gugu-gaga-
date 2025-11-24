import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSingleItemForm } from "./AddSingleItemForm";
import { AddPacketItemForm } from "./AddPacketItemForm";

interface AddItemDialogProps {
    onSuccess: () => void;
}

export function AddItemDialog({ onSuccess }: AddItemDialogProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("single");

    const handleSuccess = () => {
        setOpen(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-black">Add Inventory Item</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                        <TabsTrigger value="single" className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600">
                            Single Item
                        </TabsTrigger>
                        <TabsTrigger value="packet" className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600">
                            Packet / Pack
                        </TabsTrigger>
                        {/* Bulk entry can be added later */}
                    </TabsList>

                    <TabsContent value="single">
                        <AddSingleItemForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
                    </TabsContent>

                    <TabsContent value="packet">
                        <AddPacketItemForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
