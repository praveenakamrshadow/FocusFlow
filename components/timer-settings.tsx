'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface TimerSettingsProps {
    settings: {
        focusTime: number;
        shortBreakTime: number;
        longBreakTime: number;
        autoStartBreaks: boolean;
        autoStartPomodoros: boolean;
        notifications: boolean;
    };
    onUpdateSettings: (settings: any) => void;
}

export function TimerSettings({
    settings,
    onUpdateSettings,
}: TimerSettingsProps) {
    const [focusTime, setFocusTime] = useState(settings.focusTime);
    const [shortBreakTime, setShortBreakTime] = useState(
        settings.shortBreakTime
    );
    const [longBreakTime, setLongBreakTime] = useState(settings.longBreakTime);
    const [autoStartBreaks, setAutoStartBreaks] = useState(
        settings.autoStartBreaks
    );
    const [autoStartPomodoros, setAutoStartPomodoros] = useState(
        settings.autoStartPomodoros
    );
    const [notifications, setNotifications] = useState(settings.notifications);

    useEffect(() => {
        setFocusTime(settings.focusTime);
        setShortBreakTime(settings.shortBreakTime);
        setLongBreakTime(settings.longBreakTime);
        setAutoStartBreaks(settings.autoStartBreaks);
        setAutoStartPomodoros(settings.autoStartPomodoros);
        setNotifications(settings.notifications);
    }, [settings]);

    const handleSave = () => {
        const newSettings = {
            focusTime,
            shortBreakTime,
            longBreakTime,
            autoStartBreaks,
            autoStartPomodoros,
            notifications,
        };
        onUpdateSettings(newSettings);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Timer Settings</h2>

            <div className="space-y-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                        Focus Time: {focusTime} minutes
                    </h3>
                    <Slider
                        value={[focusTime]}
                        min={1}
                        max={120}
                        step={1}
                        onValueChange={(value) => setFocusTime(value[0])}
                        className="w-full"
                    />

                    <h3 className="text-lg font-medium">
                        Short Break: {shortBreakTime} minutes
                    </h3>
                    <Slider
                        value={[shortBreakTime]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) => setShortBreakTime(value[0])}
                        className="w-full"
                    />

                    <h3 className="text-lg font-medium">
                        Long Break: {longBreakTime} minutes
                    </h3>
                    <Slider
                        value={[longBreakTime]}
                        min={1}
                        max={60}
                        step={1}
                        onValueChange={(value) => setLongBreakTime(value[0])}
                        className="w-full"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Auto Start</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="auto-breaks"
                                className="cursor-pointer"
                            >
                                Auto start breaks
                            </Label>
                            <Switch
                                id="auto-breaks"
                                checked={autoStartBreaks}
                                onCheckedChange={setAutoStartBreaks}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="auto-pomodoros"
                                className="cursor-pointer"
                            >
                                Auto start pomodoros
                            </Label>
                            <Switch
                                id="auto-pomodoros"
                                checked={autoStartPomodoros}
                                onCheckedChange={setAutoStartPomodoros}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="notifications"
                                className="cursor-pointer"
                            >
                                Sound notifications
                            </Label>
                            <Switch
                                id="notifications"
                                checked={notifications}
                                onCheckedChange={setNotifications}
                            />
                        </div>
                    </div>
                </div>

                <Button className="w-full" onClick={handleSave}>
                    Save Settings
                </Button>
            </div>
        </div>
    );
}
