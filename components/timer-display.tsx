'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
    currentSession: string;
    sessionsCompleted: number;
    onSessionComplete: () => void;
    onSkipSession: () => void;
    onResetSession: () => void;
    timerSettings: {
        focusTime: number;
        shortBreakTime: number;
        longBreakTime: number;
        autoStartBreaks: boolean;
        autoStartPomodoros: boolean;
        notifications: boolean;
    };
}

export function TimerDisplay({
    currentSession,
    sessionsCompleted,
    onSessionComplete,
    onSkipSession,
    onResetSession,
    timerSettings,
}: TimerDisplayProps) {
    const getTotalSeconds = () => {
        switch (currentSession) {
            case 'focus':
                return timerSettings.focusTime * 60;
            case 'shortBreak':
                return timerSettings.shortBreakTime * 60;
            case 'longBreak':
                return timerSettings.longBreakTime * 60;
            default:
                return timerSettings.focusTime * 60;
        }
    };

    const [timeLeft, setTimeLeft] = useState(getTotalSeconds());
    const [isActive, setIsActive] = useState(false);
    const [progress, setProgress] = useState(100);
    const totalSecondsRef = useRef(getTotalSeconds());

    useEffect(() => {
        totalSecondsRef.current = getTotalSeconds();
        setTimeLeft(totalSecondsRef.current);
        setProgress(100);

        if (
            (currentSession === 'focus' && timerSettings.autoStartPomodoros) ||
            (currentSession !== 'focus' && timerSettings.autoStartBreaks)
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [currentSession, timerSettings]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    const newTime = prevTime - 1;
                    setProgress((newTime / totalSecondsRef.current) * 100);
                    return newTime;
                });
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            if (timerSettings.notifications) {
                try {
                    new Audio('/notification.mp3').play();
                } catch (e) {
                    console.log('Audio notification failed to play');
                }
            }
            onSessionComplete();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, onSessionComplete, timerSettings]);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const getSessionName = () => {
        switch (currentSession) {
            case 'focus':
                return 'Focus Session';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
            default:
                return 'Focus Session';
        }
    };

    const getSessionColor = () => {
        switch (currentSession) {
            case 'focus':
                return 'bg-blue-600 dark:bg-blue-500';
            case 'shortBreak':
                return 'bg-green-600 dark:bg-green-500';
            case 'longBreak':
                return 'bg-purple-600 dark:bg-purple-500';
            default:
                return 'bg-blue-600 dark:bg-blue-500';
        }
    };

    const getSessionTextColor = () => {
        switch (currentSession) {
            case 'focus':
                return 'text-blue-600 dark:text-blue-400';
            case 'shortBreak':
                return 'text-green-600 dark:text-green-400';
            case 'longBreak':
                return 'text-purple-600 dark:text-purple-400';
            default:
                return 'text-blue-600 dark:text-blue-400';
        }
    };

    const handleReset = () => {
        setTimeLeft(getTotalSeconds());
        setProgress(100);
        setIsActive(false);
        onResetSession();
    };

    return (
        <div className="flex flex-col items-center p-4 sm:p-8">
            <div className="mb-4 sm:mb-8 text-center">
                <Badge
                    variant="outline"
                    className={cn(
                        'mb-2 text-sm font-medium',
                        getSessionTextColor()
                    )}
                >
                    {currentSession === 'focus'
                        ? `Session ${sessionsCompleted + 1}/4`
                        : 'Break Time'}
                </Badge>
                <h2
                    className={cn(
                        'text-xl sm:text-2xl font-bold',
                        getSessionTextColor()
                    )}
                >
                    {getSessionName()}
                </h2>
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div
                    className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800
                    shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] 
                    dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.05)]"
                />

                <div
                    className="absolute inset-4 rounded-full bg-slate-50 dark:bg-slate-900
                    shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] 
                    dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]"
                />

                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        className="fill-none stroke-slate-200/50 dark:stroke-slate-700/50"
                        strokeWidth="3%"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        className={cn(
                            'fill-none transition-all duration-1000 ease-in-out',
                            currentSession === 'focus'
                                ? 'stroke-blue-500/70 dark:stroke-blue-400/70'
                                : currentSession === 'shortBreak'
                                ? 'stroke-green-500/70 dark:stroke-green-400/70'
                                : 'stroke-purple-500/70 dark:stroke-purple-400/70'
                        )}
                        strokeWidth="3%"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}%`}
                        strokeDashoffset={`${
                            ((100 - progress) / 100) * 2 * Math.PI * 45
                        }%`}
                        style={{
                            transition: 'stroke-dashoffset 1s linear',
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                        className={cn(
                            'text-5xl sm:text-7xl font-bold tracking-tight tabular-nums transition-colors duration-300',
                            getSessionTextColor()
                        )}
                    >
                        {formatTime()}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                    onClick={handleReset}
                >
                    <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                    variant="default"
                    size="icon"
                    className={cn(
                        'h-12 w-12 sm:h-14 sm:w-14 rounded-full',
                        currentSession === 'focus'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : currentSession === 'shortBreak'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                    )}
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? (
                        <Pause className="h-6 w-6" />
                    ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={onSkipSession}
                >
                    <SkipForward className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-2 w-full max-w-xs mt-6">
                {[1, 2, 3, 4].map((session) => (
                    <div
                        key={session}
                        className={`h-2 rounded-full ${
                            session <= sessionsCompleted % 4 ||
                            (session === 4 &&
                                sessionsCompleted % 4 === 0 &&
                                sessionsCompleted > 0)
                                ? getSessionColor()
                                : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                    />
                ))}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
                {currentSession === 'focus' ? (
                    <p>
                        Focus until {timerSettings.shortBreakTime} minute break
                    </p>
                ) : currentSession === 'shortBreak' ? (
                    <p>Break time: {timerSettings.shortBreakTime} minutes</p>
                ) : (
                    <p>Long break: {timerSettings.longBreakTime} minutes</p>
                )}
            </div>
        </div>
    );
}
