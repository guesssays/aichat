"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, Palette, Code, Heart, Zap, type LucideIcon } from "lucide-react";

export interface AIRole {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  color: string;
}

const aiRoles: AIRole[] = [
  {
    id: "assistant",
    name: "Универсальный помощник",
    description: "Дружелюбный AI для общих вопросов и задач",
    prompt: "Ты дружелюбный и полезный помощник, готовый помочь с любыми вопросами.",
    icon: Bot,
    color: "bg-blue-500"
  },
  {
    id: "creative",
    name: "Творческий партнер",
    description: "Генерирует идеи, истории и креативный контент",
    prompt: "Ты креативный партнер, специализирующийся на генерации уникальных идей, историй и творческого контента.",
    icon: Palette,
    color: "bg-purple-500"
  },
  {
    id: "tutor",
    name: "Наставник",
    description: "Объясняет сложные темы простым языком",
    prompt: "Ты терпеливый наставник, который объясняет сложные концепции простым и понятным языком.",
    icon: Lightbulb,
    color: "bg-yellow-500"
  },
  {
    id: "developer",
    name: "Программист",
    description: "Помогает с кодом и техническими вопросами",
    prompt: "Ты опытный разработчик, готовый помочь с программированием, отладкой и техническими решениями.",
    icon: Code,
    color: "bg-green-500"
  },
  {
    id: "therapist",
    name: "Психолог",
    description: "Поддерживает и дает эмоциональные советы",
    prompt: "Ты понимающий психолог, который предоставляет эмоциональную поддержку и полезные советы.",
    icon: Heart,
    color: "bg-pink-500"
  },
  {
    id: "motivator",
    name: "Мотиватор",
    description: "Вдохновляет и поддерживает достижение целей",
    prompt: "Ты энергичный мотиватор, который вдохновляет людей на достижение их целей и преодоление препятствий.",
    icon: Zap,
    color: "bg-orange-500"
  }
];

interface RoleSelectorProps {
  onRoleSelect: (role: AIRole) => void;
  selectedRole?: AIRole;
}

export default function RoleSelector({ onRoleSelect, selectedRole }: RoleSelectorProps) {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Выберите роль для AI
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Каждая роль настраивает поведение и стиль общения искусственного интеллекта
        </p>
      </div>

      {/* Гибкая сетка, красиво на всех размерах */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {aiRoles.map((role) => {
          const IconComponent = role.icon;
          const isSelected = selectedRole?.id === role.id;
          return (
            <button
              key={role.id}
              type="button"
              className="outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
              onClick={() => onRoleSelect(role)}
            >
              <Card
                className={`transition-all cursor-pointer w-full h-full text-left hover:shadow-md border-2
                  ${isSelected
                    ? "border-blue-500 shadow-lg shadow-blue-400/10 bg-blue-50/60 dark:bg-blue-950/30"
                    : "border-border hover:border-blue-300 bg-white/90 dark:bg-slate-900/50"
                  }`}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className={`p-2 rounded-full ${role.color} text-white`}>
                    <IconComponent size={20} />
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="bg-blue-500">
                      Выбрано
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <CardTitle className="text-base sm:text-lg">{role.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 text-muted-foreground">{role.description}</CardDescription>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Краткая информация о выбранной роли */}
      {selectedRole && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${selectedRole.color} text-white`}>
              <selectedRole.icon size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold">Активная роль: {selectedRole.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
        </div>
      )}
    </section>
  );
}
