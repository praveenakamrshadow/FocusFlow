'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Settings, BellRing, BellOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { TimerDisplay } from '@/components/timer-display';
import { TimerSettings } from '@/components/timer-settings';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface TimerSettingsType {
    focusTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    notifications: boolean;
    totalFocusSessions: number;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState('timer');
    const [timerSettings, setTimerSettings] = useState({
        focusTime: 52,
        shortBreakTime: 17,
        longBreakTime: 30,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        notifications: true,
        totalFocusSessions: 4,
    });

    const [currentSession, setCurrentSession] = useState('focus');
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const { toast } = useToast();

    const focusCompleteSound = useRef<HTMLAudioElement | null>(null);
    const shortBreakCompleteSound = useRef<HTMLAudioElement | null>(null);
    const longBreakCompleteSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        focusCompleteSound.current = new Audio('/sounds/focus-complete.wav');
        shortBreakCompleteSound.current = new Audio(
            '/sounds/short-break-complete.wav'
        );
        longBreakCompleteSound.current = new Audio(
            '/sounds/long-break-complete.wav'
        );
    }, []);

    const playNotificationSound = (
        type: 'focus' | 'shortBreak' | 'longBreak'
    ) => {
        if (!timerSettings.notifications) return;

        switch (type) {
            case 'focus':
                focusCompleteSound.current
                    ?.play()
                    .catch((err) => console.log('Audio play failed:', err));
                break;
            case 'shortBreak':
                shortBreakCompleteSound.current
                    ?.play()
                    .catch((err) => console.log('Audio play failed:', err));
                break;
            case 'longBreak':
                longBreakCompleteSound.current
                    ?.play()
                    .catch((err) => console.log('Audio play failed:', err));
                break;
        }
    };

    const handleSessionComplete = () => {
        if (currentSession === 'focus') {
            setSessionsCompleted((prev) => {
                const newCount = prev + 1;
                if (newCount >= timerSettings.totalFocusSessions) {
                    setCurrentSession('longBreak');
                    playNotificationSound('focus');
                } else {
                    setCurrentSession('shortBreak');
                    playNotificationSound('focus');
                }
                return newCount;
            });
        } else {
            setCurrentSession('focus');
            if (currentSession === 'longBreak') {
                playNotificationSound('longBreak');
                setSessionsCompleted(0);
            } else {
                playNotificationSound('shortBreak');
            }
        }
    };

    const handleSkipSession = () => {
        if (currentSession === 'focus') {
            if (sessionsCompleted + 1 >= timerSettings.totalFocusSessions) {
                setCurrentSession('longBreak');
            } else {
                setCurrentSession('shortBreak');
            }
            setSessionsCompleted((prev) => prev + 1);
        } else {
            setCurrentSession('focus');
            if (currentSession === 'longBreak') {
                setSessionsCompleted(0);
            }
        }
    };

    const handleResetSession = () => {};

    const handleUpdateSettings = (newSettings: TimerSettingsType) => {
        setTimerSettings(newSettings);
        toast({
            title: 'Settings saved',
            description: 'Your timer settings have been updated successfully.',
            duration: 3000,
        });
    };

    const toggleNotifications = () => {
        setTimerSettings((prev) => ({
            ...prev,
            notifications: !prev.notifications,
        }));
    };

    const resetAllSessions = () => {
        setCurrentSession('focus');
        setSessionsCompleted(0);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-start p-2 sm:p-4">
            <audio
                id="focusComplete"
                src="/sounds/focus-complete.wav"
                preload="auto"
            />
            <audio
                id="shortBreakComplete"
                src="/sounds/short-break-complete.wav"
                preload="auto"
            />
            <audio
                id="longBreakComplete"
                src="/sounds/long-break-complete.wav"
                preload="auto"
            />

            <div className="w-full max-w-5xl px-2 sm:px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between py-2 sm:py-4 gap-2 sm:gap-0">
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        <span>FocusFlow</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            activeTab === 'timer'
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="icon"
                                        onClick={() => setActiveTab('timer')}
                                        className="rounded-full"
                                    >
                                        <Clock className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Timer</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            activeTab === 'settings'
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="icon"
                                        onClick={() => setActiveTab('settings')}
                                        className="rounded-full"
                                    >
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={resetAllSessions}
                                        className="rounded-full"
                                    >
                                        <RotateCcw className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Reset all sessions</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleNotifications}
                                        className="rounded-full"
                                    >
                                        {timerSettings.notifications ? (
                                            <BellRing className="h-5 w-5" />
                                        ) : (
                                            <BellOff className="h-5 w-5" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>
                                        {timerSettings.notifications
                                            ? 'Mute'
                                            : 'Unmute'}{' '}
                                        notifications
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

                        <ThemeToggle />
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/30">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsContent value="timer" className="p-0 m-0">
                            <TimerDisplay
                                currentSession={currentSession}
                                sessionsCompleted={sessionsCompleted}
                                onSessionComplete={handleSessionComplete}
                                onSkipSession={handleSkipSession}
                                onResetSession={handleResetSession}
                                timerSettings={timerSettings}
                            />
                        </TabsContent>
                        <TabsContent value="settings" className="p-0 m-0">
                            <TimerSettings
                                settings={timerSettings}
                                onUpdateSettings={handleUpdateSettings}
                                onSave={() => setActiveTab('timer')}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}
