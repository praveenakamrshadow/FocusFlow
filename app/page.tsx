'use client';

import { useState } from 'react';
import { Clock, Settings, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { TimerDisplay } from '@/components/timer-display';
import { TimerSettings } from '@/components/timer-settings';
import { WebsiteBlocklist } from '@/components/website-blocklist';
import { ThemeProvider } from '@/components/theme-provider';

export default function Home() {
    const [activeTab, setActiveTab] = useState('timer');
    const [timerSettings, setTimerSettings] = useState({
        focusTime: 52,
        shortBreakTime: 17,
        longBreakTime: 30,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        notifications: true,
    });

    const [currentSession, setCurrentSession] = useState('focus');
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const handleSessionComplete = () => {
        if (currentSession === 'focus') {
            setSessionsCompleted((prev) => {
                const newCount = prev + 1;
                if (newCount % 4 === 0) {
                    setCurrentSession('longBreak');
                } else {
                    setCurrentSession('shortBreak');
                }
                return newCount;
            });
        } else {
            setCurrentSession('focus');
        }
    };

    const handleSkipSession = () => {
        if (currentSession === 'focus') {
            if ((sessionsCompleted + 1) % 4 === 0) {
                setCurrentSession('longBreak');
            } else {
                setCurrentSession('shortBreak');
            }
            setSessionsCompleted((prev) => prev + 1);
        } else {
            setCurrentSession('focus');
        }
    };

    const handleResetSession = () => {
        // Just reset the current session, don't change the type
    };

    const handleUpdateSettings = (newSettings) => {
        setTimerSettings(newSettings);
    };

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-3xl shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Clock className="h-6 w-6 text-primary" />
                                <span>FocusFlow</span>
                            </h1>
                            <div className="flex items-center gap-2">
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
                                <Button
                                    variant={
                                        activeTab === 'blocklist'
                                            ? 'default'
                                            : 'ghost'
                                    }
                                    size="icon"
                                    onClick={() => setActiveTab('blocklist')}
                                    className="rounded-full"
                                >
                                    <List className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

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
                                />
                            </TabsContent>
                            <TabsContent value="blocklist" className="p-0 m-0">
                                <WebsiteBlocklist />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Website block overlay - this would be shown when visiting blocked sites */}
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm hidden">
                    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-white p-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <h2 className="text-3xl font-bold mb-4">
                            Stay Focused!
                        </h2>
                        <p className="text-xl italic mb-8">
                            "The key to success is to focus on goals, not
                            obstacles."
                        </p>
                        <p className="text-center mb-6">
                            This website is currently blocked during your focus
                            session. Return to your work and stay productive!
                        </p>
                        <Button
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            Return to Timer
                        </Button>
                    </div>
                </div>
            </main>
        </ThemeProvider>
    );
}
