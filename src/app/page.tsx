"use client";

import { useState } from "react";
import RoleSelector, { AIRole } from "@/components/role-selector";
import ChatInterface from "@/components/chat-interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, ArrowLeft } from "lucide-react";

type ViewMode = "role-selection" | "chat";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<AIRole>();
  const [viewMode, setViewMode] = useState<ViewMode>("role-selection");

  const handleRoleSelect = (role: AIRole) => {
    setSelectedRole(role);
    setViewMode("chat");
  };

  const handleBackToRoles = () => {
    setViewMode("role-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 flex flex-col">
      {/* Header */}
<header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
  <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0">
      {/* Левая часть: Назад + Лого + Название */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
        {viewMode === "chat" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToRoles}
            className="mr-2 px-2 h-8 text-xs sm:text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Назад
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Bot className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Roles Chat
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Персонализированный ИИ помощник
            </p>
          </div>
        </div>
        {/* Бейдж с ролью только на больших экранах */}
        {selectedRole && viewMode === "chat" && (
          <Badge variant="secondary" className="hidden sm:flex ml-4">
            <selectedRole.icon size={14} />
            {selectedRole.name}
          </Badge>
        )}
      </div>
      {/* Правая часть: Demo Mode всегда справа */}
      <div className="flex-shrink-0">
        <Badge variant="outline" className="gap-1">
          <Sparkles size={12} />
          Demo Mode
        </Badge>
      </div>
    </div>
  </div>
</header>


      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-1 sm:px-4 py-4 sm:py-8 flex-1 flex flex-col">
        {viewMode === "role-selection" ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-5 sm:mb-6">
                <div className="inline-flex p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <Bot className="text-white" size={38} />
                </div>
                <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                  Персональный AI
                </h1>
                <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                  Выберите роль для искусственного интеллекта и получите уникальный опыт общения. Каждая роль настраивает стиль, подход и манеру общения AI.
                </p>
              </div>
              {/* Преимущества — мобильный столбец, десктоп строка */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-2xl mx-auto mb-6 sm:mb-8">
                <Card className="flex-1 p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">6</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Уникальных ролей</div>
                </Card>
                <Card className="flex-1 p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">∞</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Возможностей</div>
                </Card>
                <Card className="flex-1 p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Доступность</div>
                </Card>
              </div>
            </div>

            {/* Role Selector */}
            <RoleSelector
              onRoleSelect={handleRoleSelect}
              selectedRole={selectedRole}
            />

            {/* Features Section */}
            <div className="mt-10 sm:mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-8">
                Почему выбирают AI Roles Chat?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Bot className="text-blue-600" size={22} />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2">Персонализация</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Каждая роль адаптирует ответы под конкретные задачи и стиль общения
                  </p>
                </Card>
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Sparkles className="text-purple-600" size={22} />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2">Интуитивность</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Простой и понятный интерфейс для комфортного общения с AI
                  </p>
                </Card>
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <ArrowLeft className="text-green-600" size={22} />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2">Гибкость</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Легко переключайтесь между ролями в зависимости от ваших потребностей
                  </p>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col">
            <ChatInterface
              selectedRole={selectedRole}
              onRoleChange={handleBackToRoles}
            />
          </div>
        )}
      </main>
    </div>
  );
}
