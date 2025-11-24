"use client";

export const dynamic = 'force-dynamic';

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
import { useToast } from "@/components/ui/use-toast";

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
  user: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
  owner:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
  assistant: "bg-white/90 border border-white/40 text-slate-900 backdrop-blur",
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

  const remaining = MAX_PROMPT_LENGTH - messageDraft.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="space-y-4 text-sm">
      {payload.intent && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Intent
          </span>
          <span className="font-medium">{String(payload.intent)}</span>
        </div>
      )}
      {payload.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Unable to run the analysis at the moment. ({String(payload.error)})
        </div>
      )}
      {payload.answer && typeof payload.answer === "string" && (
        <p className="whitespace-pre-wrap leading-relaxed text-slate-800">
          {payload.answer}
        </p>
      )}
      {hasRows ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {Object.keys(rows![0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-slate-900"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows!.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  {Object.keys(rows![0]).map((key) => (
                    <td key={key} className="px-4 py-3 text-slate-700">
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
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
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
  const [sending, setSending] = useState(false);
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  const loadThreads = useCallback(
    async (tid: string): Promise<ThreadSummary[]> => {
      setThreadsLoading(true);
      try {
        const data = await ChatAPI.listThreads(tid);
        const safe = Array.isArray(data) ? (data as ThreadSummary[]) : [];
        setThreads(safe);
        if (safe.length === 0) {
          setSelectedThreadId(null);
        }
        setGlobalError(null);
        return safe;
      } catch (error: any) {
        setThreads([]);
        setSelectedThreadId(null);
        setGlobalError(error?.message || "Unable to load conversations");
        return [];
      } finally {
        setThreadsLoading(false);
      }
    },
    []
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
    [show]
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
    if (
      selectedThreadId &&
      !threads.some((thread) => thread.id === selectedThreadId)
    ) {
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
    setCreatingThread(true);
    try {
      const created = await ChatAPI.createThread(tenantId);
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

  const MAX_PROMPT_LENGTH = 300;
  const remaining = MAX_PROMPT_LENGTH - messageDraft.length;
  const isOverLimit = remaining < 0;

  const handleSendMessage = async () => {
    if (!tenantId) return;
    const prompt = messageDraft.trim();
    if (!prompt) return;
    if (prompt.length > MAX_PROMPT_LENGTH) {
      show({
        variant: "destructive",
        title: "Prompt too long",
        description: `Limit is ${MAX_PROMPT_LENGTH} characters. Please shorten your question.`,
      });
      return;
    }
    setMessageDraft("");
    setSending(true);
    setAssistantThinking(true);
    try {
      let threadIdToUse = selectedThreadId;
      if (!threadIdToUse) {
        const created = await ChatAPI.createThread(tenantId);
        const refreshed = await loadThreads(tenantId);
        threadIdToUse =
          (created && typeof created.id === "number"
            ? created.id
            : undefined) ??
          (refreshed.length > 0 ? refreshed[0].id : undefined);
        if (threadIdToUse) {
          setSelectedThreadId(threadIdToUse);
        }
      }
      if (!threadIdToUse) {
        throw new Error("Unable to start a new conversation");
      }

      await ChatAPI.sendMessage(tenantId, threadIdToUse, prompt);
      await loadMessages(tenantId, threadIdToUse);
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

  const handleComposerKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const isLoadingThreads = threadsLoading || bootstrapLoading;
  const isLoadingMessages = messagesLoading || bootstrapLoading;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h1 className="text-3xl font-semibold leading-tight text-slate-900">
          Zemen AI Assistant
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Ask questions about sales, inventory, and staff performance. The
          assistant runs read-only analytics on your tenant data and summarises
          the results for quick insight.
        </p>
      </div>

      {globalError && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {globalError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Conversations
            </h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHistory((prev) => !prev)}
              >
                {showHistory ? "Hide history" : "Show history"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => tenantId && loadThreads(tenantId)}
                disabled={!tenantId || isLoadingThreads}
              >
                Refresh
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleCreateThread}
              disabled={!tenantId || creatingThread}
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {creatingThread ? "Creating…" : "Start new conversation"}
            </Button>
          </div>
          {showHistory ? (
            <>
              <div className="h-px w-full bg-slate-200" />
              {isLoadingThreads ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : threads.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                  No conversations yet. Start a new one to ask the assistant
                  anything about your pharmacy.
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
                        className={`group w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        <div className="font-semibold">{title}</div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">
                          Thread #{thread.id}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
              Tap “Show history” to browse your previous conversations.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                {selectedThread
                  ? normalizeThreadTitle(selectedThread, 0)
                  : "Conversation"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    tenantId &&
                    selectedThreadId &&
                    loadMessages(tenantId, selectedThreadId)
                  }
                  disabled={!tenantId || !selectedThreadId || isLoadingMessages}
                >
                  Refresh
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              The assistant uses safe, read-only queries. Ask for sales
              summaries, inventory gaps, or staff performance insights.
            </p>
          </div>
          <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {isLoadingMessages ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : !selectedThreadId ? (
              <div className="flex h-full items-center justify-center p-6 text-sm text-slate-600">
                Select a conversation to view messages.
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-sm text-slate-600">
                Ask your first question to begin.
              </div>
            ) : (
              <div className="flex h-[55vh] flex-col gap-3 overflow-y-auto p-4 pr-6">
                {messages.map((message) => {
                  const roleClass =
                    ROLE_TONE[message.role] || ROLE_TONE.assistant;
                  const label = ROLE_LABELS[message.role] || message.role;
                  const assistantPayload =
                    message.role === "assistant"
                      ? parseAssistantPayload(message.content)
                      : null;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "assistant"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xl rounded-2xl px-3 py-2 text-sm shadow ${roleClass}`}
                      >
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
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
                    <div className="max-w-xs rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 shadow-sm">
                      Assistant is analysing your data…
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <form className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700">
              <span>Ask a question</span>
              <span
                className={`tracking-normal ${
                  isOverLimit ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {remaining >= 0
                  ? `${remaining} characters left`
                  : `${Math.abs(remaining)} over limit`}
              </span>
            </div>
            <textarea
              className="min-h-[120px] w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="e.g. Show me the top selling medicines this week"
              value={messageDraft}
              maxLength={MAX_PROMPT_LENGTH + 100}
              onChange={(event) => setMessageDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !tenantId || !selectedThreadId || sending || isOverLimit
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {sending ? "Sending…" : "Send"}
            </Button>
          </form>
          )
        </div>
      </div>
    </div>
  );
}
