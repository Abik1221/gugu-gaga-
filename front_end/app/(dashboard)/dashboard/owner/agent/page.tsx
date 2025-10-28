"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthAPI, ChatAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

type ThreadSummary = {
  id: number;
  title?: string | null;
};

type ChatMessageRecord = {
  id: number;
  role: string;
  content: string;
};

const ROLE_LABELS: Record<string, string> = {
  user: "You",
  owner: "You",
  assistant: "Assistant",
};

const ROLE_TONE: Record<string, string> = {
  user: "bg-emerald-600 text-white",
  owner: "bg-emerald-600 text-white",
  assistant: "bg-white border border-gray-200 text-gray-900",
};

function normalizeThreadTitle(thread: ThreadSummary, index: number): string {
  const raw = (thread.title || "").trim();
  if (raw) return raw;
  return `Conversation #${index + 1}`;
}

function parseAssistantPayload(content: string): any | null {
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    if (content.startsWith("{") && content.includes("'")) {
      try {
        const sanitized = content.replace(/'/g, '"');
        return JSON.parse(sanitized);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function AssistantContent({ payload }: { payload: any }) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const rows = Array.isArray(payload.rows) ? payload.rows : null;
  const hasRows = rows && rows.length > 0;

  return (
    <div className="space-y-3 text-sm">
      {payload.intent && (
        <div className="flex items-center gap-2 rounded border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700">
          <span className="text-xs font-semibold uppercase tracking-wide">Intent</span>
          <span className="font-medium">{String(payload.intent)}</span>
        </div>
      )}
      {payload.error && (
        <div className="rounded border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          Unable to run the analysis at the moment. ({String(payload.error)})
        </div>
      )}
      {payload.answer && typeof payload.answer === "string" && (
        <p className="whitespace-pre-wrap leading-relaxed text-gray-800">{payload.answer}</p>
      )}
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(rows![0]).map((key) => (
                  <th
                    key={key}
                    className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows!.map((row, idx) => (
                <tr key={idx}>
                  {Object.keys(rows![0]).map((key) => (
                    <td key={key} className="px-3 py-2 text-gray-700">
                      {row[key] === null || row[key] === undefined
                        ? "—"
                        : typeof row[key] === "number"
                        ? row[key].toLocaleString("en-US")
                        : String(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {!payload.error && rows && rows.length === 0 && (
        <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          The query completed but returned no rows.
        </div>
      )}
    </div>
  );
}

export default function OwnerAgentPage() {
  const { show } = useToast();

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [creatingThread, setCreatingThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId],
  );

  const loadThreads = useCallback(
    async (tid: string) => {
      setThreadsLoading(true);
      try {
        const data = await ChatAPI.listThreads(tid);
        const safe = Array.isArray(data) ? (data as ThreadSummary[]) : [];
        setThreads(safe);
        if (safe.length === 0) {
          setSelectedThreadId(null);
        }
        setGlobalError(null);
      } catch (error: any) {
        setGlobalError(error?.message || "Unable to load conversations");
      } finally {
        setThreadsLoading(false);
      }
    },
    [],
  );

  const loadMessages = useCallback(
    async (tid: string, threadId: number) => {
      setMessagesLoading(true);
      try {
        const data = await ChatAPI.listMessages(tid, threadId);
        const safe = Array.isArray(data) ? (data as ChatMessageRecord[]) : [];
        setMessages(safe);
      } catch (error: any) {
        show({
          variant: "destructive",
          title: "Failed to load thread",
          description: error?.message || "Unable to fetch messages.",
        });
      } finally {
        setMessagesLoading(false);
      }
    },
    [show],
  );

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      setBootstrapLoading(true);
      try {
        const profile = await AuthAPI.me();
        if (!active) return;
        const tid = profile?.tenant_id || null;
        if (!tid) {
          setGlobalError("You do not have an active tenant to chat against.");
          return;
        }
        setTenantId(tid);
        await loadThreads(tid);
      } catch (error: any) {
        if (!active) return;
        setGlobalError(error?.message || "Unable to load owner profile.");
      } finally {
        if (active) setBootstrapLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [loadThreads]);

  useEffect(() => {
    if (selectedThreadId && !threads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(threads[0]?.id ?? null);
    } else if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  useEffect(() => {
    if (!tenantId || !selectedThreadId) {
      setMessages([]);
      return;
    }
    loadMessages(tenantId, selectedThreadId);
  }, [tenantId, selectedThreadId, loadMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, assistantThinking]);

  const handleCreateThread = async () => {
    if (!tenantId) return;
    const title = newThreadTitle.trim();
    setCreatingThread(true);
    try {
      const created = await ChatAPI.createThread(tenantId, title || "Owner conversation");
      setNewThreadTitle("");
      await loadThreads(tenantId);
      if (created?.id) {
        setSelectedThreadId(created.id);
      }
      setMessages([]);
    } catch (error: any) {
      show({
        variant: "destructive",
        title: "Could not create thread",
        description: error?.message || "Please try again.",
      });
    } finally {
      setCreatingThread(false);
    }
  };

  const handleSendMessage = async () => {
    if (!tenantId || !selectedThreadId) return;
    const prompt = messageDraft.trim();
    if (!prompt) return;
    setMessageDraft("");
    setSending(true);
    setAssistantThinking(true);
    try {
      await ChatAPI.sendMessage(tenantId, selectedThreadId, prompt);
      await loadMessages(tenantId, selectedThreadId);
      await loadThreads(tenantId);
    } catch (error: any) {
      show({
        variant: "destructive",
        title: "Message failed",
        description: error?.message || "Unable to send message.",
      });
      setMessageDraft(prompt);
    } finally {
      setSending(false);
      setAssistantThinking(false);
    }
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const isLoadingThreads = threadsLoading || bootstrapLoading;
  const isLoadingMessages = messagesLoading || bootstrapLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Zemen AI Assistant</h1>
        <p className="max-w-3xl text-sm text-gray-500">
          Ask questions about sales, inventory, and staff performance. The assistant runs read-only
          analytics on your tenant data and summarises the results for quick insight.
        </p>
      </div>

      {globalError && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {globalError}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Conversations</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => tenantId && loadThreads(tenantId)}
              disabled={!tenantId || isLoadingThreads}
            >
              Refresh
            </Button>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Conversation title"
              value={newThreadTitle}
              onChange={(event) => setNewThreadTitle(event.target.value)}
            />
            <Button onClick={handleCreateThread} disabled={!tenantId || creatingThread}>
              {creatingThread ? "Creating…" : "Start new conversation"}
            </Button>
          </div>
          <div className="h-px w-full bg-gray-100" />
          {isLoadingThreads ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : threads.length === 0 ? (
            <div className="rounded border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
              No conversations yet. Start a new one to ask the assistant anything about your pharmacy.
            </div>
          ) : (
            <div className="space-y-2">
              {threads.map((thread, index) => {
                const title = normalizeThreadTitle(thread, index);
                const isActive = thread.id === selectedThreadId;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full rounded border px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                    }`}
                  >
                    <div className="font-medium">{title}</div>
                    <div className="text-xs text-gray-500">Thread #{thread.id}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                {selectedThread ? normalizeThreadTitle(selectedThread, 0) : "Conversation"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => tenantId && selectedThreadId && loadMessages(tenantId, selectedThreadId)}
                  disabled={!tenantId || !selectedThreadId || isLoadingMessages}
                >
                  Refresh
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              The assistant uses safe, read-only queries. Ask for sales summaries, inventory gaps, or staff
              performance insights.
            </p>
          </div>

          <div className="flex-1 overflow-hidden rounded border border-gray-100 bg-gray-50">
            {isLoadingMessages ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : !selectedThreadId ? (
              <div className="flex h-full items-center justify-center p-6 text-sm text-gray-500">
                Select a conversation to view messages.
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-sm text-gray-500">
                Ask your first question to begin.
              </div>
            ) : (
              <div className="flex h-[55vh] flex-col gap-3 overflow-y-auto p-4 pr-6">
                {messages.map((message) => {
                  const roleClass = ROLE_TONE[message.role] || ROLE_TONE.assistant;
                  const label = ROLE_LABELS[message.role] || message.role;
                  const assistantPayload =
                    message.role === "assistant" ? parseAssistantPayload(message.content) : null;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xl rounded-lg px-3 py-2 text-sm shadow-sm ${roleClass}`}
                      >
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                          {label}
                        </div>
                        {assistantPayload ? (
                          <AssistantContent payload={assistantPayload} />
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {assistantThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                      Assistant is analysing your data…
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form
            className="flex flex-col gap-3 rounded border border-gray-100 bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage();
            }}
          >
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ask a question
            </label>
            <textarea
              className="min-h-[120px] w-full resize-y rounded border border-gray-200 p-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g. Show me the top selling medicines this week"
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              disabled={!tenantId || !selectedThreadId || sending}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Press Enter to send, Shift + Enter for a new line.</span>
              <Button type="submit" disabled={!tenantId || !selectedThreadId || sending}>
                {sending ? "Sending…" : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
