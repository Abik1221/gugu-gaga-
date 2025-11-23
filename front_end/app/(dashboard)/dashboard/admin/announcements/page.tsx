"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Megaphone } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

type Announcement = {
    id: number;
    title: string;
    content: string;
    target_audience: string;
    is_active: boolean;
    created_at: string;
};

export default function AnnouncementsPage() {
    const { show } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    async function loadAnnouncements() {
        try {
            const data = await AdminAPI.system.announcements();
            setAnnouncements(data as Announcement[]);
        } catch (error) {
            show({ variant: "destructive", title: "Error", description: "Failed to load announcements" });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await AdminAPI.system.deleteAnnouncement(id);
            show({ variant: "success", title: "Deleted", description: "Announcement deleted." });
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            show({ variant: "destructive", title: "Error", description: "Failed to delete announcement" });
        }
    }

    if (loading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
                        <p className="mt-2 text-slate-600">Manage system-wide notifications for users.</p>
                    </div>
                    <CreateAnnouncementDialog
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                        onSuccess={() => {
                            loadAnnouncements();
                            setIsCreateOpen(false);
                        }}
                    />
                </div>

                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <Megaphone className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-2 text-sm font-semibold text-slate-900">No announcements</h3>
                            <p className="mt-1 text-sm text-slate-500">Get started by creating a new announcement.</p>
                        </div>
                    ) : (
                        announcements.map((announcement) => (
                            <Card key={announcement.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-900">{announcement.title}</CardTitle>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Target: <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">{announcement.target_audience}</span>
                                            <span className="mx-2">•</span>
                                            {new Date(announcement.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(announcement.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 whitespace-pre-wrap">{announcement.content}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function CreateAnnouncementDialog({
    open,
    onOpenChange,
    onSuccess,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const { show } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        target_audience: "all",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await AdminAPI.system.createAnnouncement(formData);
            show({ variant: "success", title: "Created", description: "Announcement published successfully." });
            setFormData({ title: "", content: "", target_audience: "all" });
            onSuccess();
        } catch (error) {
            show({ variant: "destructive", title: "Error", description: "Failed to create announcement" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> New Announcement
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            required
                            placeholder="e.g., Scheduled Maintenance"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Audience</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.target_audience}
                            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                        >
                            <option value="all">All Users</option>
                            <option value="pharmacy_owner">Pharmacy Owners</option>
                            <option value="affiliate">Affiliates</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                            required
                            placeholder="Enter announcement details..."
                            className="min-h-[100px]"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {loading ? "Publishing..." : "Publish Announcement"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
