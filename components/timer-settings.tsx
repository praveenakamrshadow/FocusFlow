'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface TimerSettingsProps {
    settings: {
        focusTime: number;
        shortBreakTime: number;
        longBreakTime: number;
        autoStartBreaks: boolean;
        autoStartPomodoros: boolean;
        notifications: boolean;
        totalFocusSessions: number;
    };
    onUpdateSettings: (settings: any) => void;
    onSave?: () => void;
}

interface TimeInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    max: number;
}

const TimeInput = ({
    label,
    value,
    onChange,
    max = 60,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    max?: number;
}) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHours = Math.min(
            Math.max(0, parseInt(e.target.value) || 0),
            Math.floor(max / 60)
        );
        const newTotal = newHours * 60 + minutes;
        onChange(Math.max(1, newTotal));
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinutes = Math.min(
            Math.max(0, parseInt(e.target.value) || 0),
            59
        );
        const newTotal = hours * 60 + newMinutes;
        onChange(Math.max(1, newTotal));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">
                {label}: {value} minutes
            </h3>
            <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                    <Slider
                        value={[value]}
                        min={1}
                        max={max}
                        step={1}
                        onValueChange={(val) => onChange(Math.max(1, val[0]))}
                        className="w-full cursor-grab active:cursor-grabbing"
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[180px]">
                    <div className="flex flex-col">
                        <Input
                            type="number"
                            value={hours}
                            onChange={handleHoursChange}
                            min={0}
                            max={Math.floor(max / 60)}
                            className="w-20"
                        />
                        <Label className="text-xs text-center mt-1">
                            Hours
                        </Label>
                    </div>
                    <span className="text-lg font-medium">:</span>
                    <div className="flex flex-col">
                        <Input
                            type="number"
                            value={minutes}
                            onChange={handleMinutesChange}
                            min={0}
                            max={59}
                            className="w-20"
                        />
                        <Label className="text-xs text-center mt-1">
                            Minutes
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function TimerSettings({
    settings,
    onUpdateSettings,
    onSave,
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
    const [totalFocusSessions, setTotalFocusSessions] = useState(
        settings.totalFocusSessions
    );

    useEffect(() => {
        setFocusTime(settings.focusTime);
        setShortBreakTime(settings.shortBreakTime);
        setLongBreakTime(settings.longBreakTime);
        setAutoStartBreaks(settings.autoStartBreaks);
        setAutoStartPomodoros(settings.autoStartPomodoros);
        setNotifications(settings.notifications);
        setTotalFocusSessions(settings.totalFocusSessions);
    }, [settings]);

    const handleSave = () => {
        const newSettings = {
            focusTime: Math.max(1, focusTime),
            shortBreakTime: Math.max(1, shortBreakTime),
            longBreakTime: Math.max(1, longBreakTime),
            autoStartBreaks,
            autoStartPomodoros,
            notifications,
            totalFocusSessions: Math.max(1, totalFocusSessions),
        };
        onUpdateSettings(newSettings);
        onSave?.();
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Timer Settings</h2>

            <div className="space-y-8">
                <div className="space-y-6">
                    <TimeInput
                        label="Focus Time"
                        value={focusTime}
                        onChange={setFocusTime}
                        max={120}
                    />

                    <TimeInput
                        label="Short Break"
                        value={shortBreakTime}
                        onChange={setShortBreakTime}
                        max={30}
                    />

                    <TimeInput
                        label="Long Break"
                        value={longBreakTime}
                        onChange={setLongBreakTime}
                        max={60}
                    />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                            Total Focus Sessions: {totalFocusSessions}
                        </h3>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1">
                                <Slider
                                    value={[totalFocusSessions]}
                                    min={1}
                                    max={12}
                                    step={1}
                                    onValueChange={(val) =>
                                        setTotalFocusSessions(
                                            Math.max(1, val[0])
                                        )
                                    }
                                    className="w-full cursor-grab active:cursor-grabbing"
                                />
                            </div>
                            <Input
                                type="number"
                                value={totalFocusSessions}
                                onChange={(e) =>
                                    setTotalFocusSessions(
                                        Math.max(
                                            1,
                                            parseInt(e.target.value) || 1
                                        )
                                    )
                                }
                                min="1"
                                max="12"
                                className="w-20"
                            />
                        </div>
                    </div>
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
