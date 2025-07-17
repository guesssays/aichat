"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Settings } from "lucide-react";
import { AIRole } from "./role-selector";
import { aiService } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedRole?: AIRole;
  onRoleChange: () => void;
}

export default function ChatInterface({ selectedRole, onRoleChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Скроллим вниз при новых сообщениях
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedRole && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Привет! Я буду выступать в роли "${selectedRole.name}". ${selectedRole.description} Как дела? Чем могу помочь?`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedRole, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedRole) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const messagesForAI = [
        { role: "system", content: selectedRole.prompt },
        ...messages.map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
        })),
        { role: "user", content: input.trim() }
      ];

      const aiResponse = await aiService.sendMessage(messagesForAI);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Ошибка при обращении к AI API. Проверьте токен.",
          sender: "ai",
          timestamp: new Date()
        }
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!selectedRole) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <Settings className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-xl font-semibold mb-2">Выберите роль для AI</h3>
          <p className="text-muted-foreground">
            Чтобы начать общение, сначала выберите подходящую роль для искусственного интеллекта
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[80vh] min-h-[400px] max-h-[90vh] flex flex-col shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-2 rounded-full ${selectedRole.color} text-white`}>
            <selectedRole.icon size={20} />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg">{selectedRole.name}</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">Онлайн • Готов к общению</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onRoleChange} className="h-8 px-2 text-xs sm:text-sm">
          <Settings size={14} className="mr-1" />
          Сменить роль
        </Button>
      </CardHeader>

      {/* Весь скроллируемый чат */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto px-2 sm:px-4 pb-2 sm:pb-4 space-y-2 sm:space-y-4 w-full"
          style={{ overflowX: "hidden" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } w-full`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 mt-1">
                  <AvatarFallback className={`${selectedRole.color} text-white text-xs`}>
                    <selectedRole.icon size={13} />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`
                  rounded-lg px-3 py-2 sm:px-4 sm:py-3
                  break-words
                  markdown-chat
                  text-sm sm:text-base
                  ${message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-muted"}
                `}
                style={{
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-line"
                }}
              >
                <div className="max-w-full break-words overflow-x-auto">
                  <ReactMarkdown
                    children={message.content}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: (props) => (
                        <a {...props} className="text-blue-400 underline break-all" target="_blank" rel="noopener noreferrer"/>
                      ),
                      code: (props) => (
                        <code {...props} className="bg-zinc-900/60 px-1 py-0.5 rounded text-xs overflow-x-auto" />
                      ),
                      p: (props) => <p {...props} className="mb-2 last:mb-0" />
                    }}
                  />
                </div>
                <p className={`text-[10px] sm:text-xs mt-2 ${
                  message.sender === "user" ? "text-blue-100" : "text-muted-foreground"
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.sender === "user" && (
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 mt-1">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User size={13} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start w-full">
              <Avatar className="w-7 h-7 sm:w-8 sm:h-8 mt-1">
                <AvatarFallback className={`${selectedRole.color} text-white text-xs`}>
                  <selectedRole.icon size={13} />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2 max-w-full">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Форма ввода всегда прижата к низу */}
{/* Форма ввода всегда прижата к низу */}
<div className="border-t py-2 px-2 sm:px-4 bg-card w-full">
  <div className="flex gap-1 sm:gap-2 w-full">
    <Textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder={`Напишите сообщение для ${selectedRole.name}...`}
      className="min-h-[38px] sm:min-h-[48px] resize-none text-xs sm:text-sm w-full"
      disabled={isLoading}
    />
    <Button
      onClick={sendMessage}
      disabled={!input.trim() || isLoading}
      size="sm"
      className="px-3 h-9 sm:h-11"
    >
      <Send size={16} />
    </Button>
  </div>
  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 text-center">
    Enter — отправить • Shift+Enter — новая строка
  </p>
  <p className="text-[11px] sm:text-xs text-yellow-600 dark:text-yellow-400 mt-1 text-center">
    ⚠️ Ответ от ИИ может занять до 30 секунд. Пожалуйста, дождитесь загрузки.
  </p>
</div>

      </div>
    </Card>
  );
}
