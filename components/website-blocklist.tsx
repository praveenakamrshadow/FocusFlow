'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WebsiteBlocklist() {
    const [blocklistActive, setBlocklistActive] = useState(true);
    const [newUrl, setNewUrl] = useState('');
    const [blockedUrls, setBlockedUrls] = useState([
        'facebook.com',
        'twitter.com',
        'instagram.com',
        'reddit.com',
    ]);
    const [allowedUrls, setAllowedUrls] = useState([
        'docs.google.com',
        'notion.so',
    ]);
    const [blockMessage, setBlockMessage] = useState(
        'This website is currently blocked during your focus session.'
    );
    const [blockQuote, setBlockQuote] = useState(
        'The key to success is to focus on goals, not obstacles.'
    );

    const addToBlocklist = () => {
        if (newUrl && !blockedUrls.includes(newUrl)) {
            setBlockedUrls([...blockedUrls, newUrl]);
            setNewUrl('');
        }
    };

    const addToAllowlist = () => {
        if (newUrl && !allowedUrls.includes(newUrl)) {
            setAllowedUrls([...allowedUrls, newUrl]);
            setNewUrl('');
        }
    };

    const removeFromBlocklist = (url: string) => {
        setBlockedUrls(blockedUrls.filter((item) => item !== url));
    };

    const removeFromAllowlist = (url: string) => {
        setAllowedUrls(allowedUrls.filter((item) => item !== url));
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Website Blocking</h2>
                <div className="flex items-center gap-2">
                    <Label htmlFor="blocking-active" className="cursor-pointer">
                        Active
                    </Label>
                    <Switch
                        id="blocking-active"
                        checked={blocklistActive}
                        onCheckedChange={setBlocklistActive}
                    />
                </div>
            </div>

            {blocklistActive ? (
                <Alert className="mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
                    <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-600 dark:text-green-400">
                        Blocking Active
                    </AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        Website blocking is currently active. Blocked sites will
                        be restricted during focus sessions.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-600 dark:text-amber-400">
                        Blocking Inactive
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-300">
                        Website blocking is currently disabled. Enable it to
                        restrict access to distracting sites.
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="blocklist" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="blocklist">Blocklist</TabsTrigger>
                    <TabsTrigger value="allowlist">Allowlist</TabsTrigger>
                </TabsList>

                <TabsContent value="blocklist" className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter website URL (e.g., facebook.com)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && addToBlocklist()
                            }
                        />
                        <Button onClick={addToBlocklist}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        {blockedUrls.length > 0 ? (
                            <ul className="divide-y">
                                {blockedUrls.map((url, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <span>{url}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeFromBlocklist(url)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                No websites in blocklist
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="allowlist" className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter website URL (e.g., notion.so)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && addToAllowlist()
                            }
                        />
                        <Button onClick={addToAllowlist}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        {allowedUrls.length > 0 ? (
                            <ul className="divide-y">
                                {allowedUrls.map((url, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <span>{url}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeFromAllowlist(url)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                No websites in allowlist
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-medium mb-2">Block Screen Settings</h3>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="block-quote">Motivational Quote</Label>
                        <Input
                            id="block-quote"
                            placeholder="Enter a motivational quote"
                            value={blockQuote}
                            onChange={(e) => setBlockQuote(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="block-message">Block Message</Label>
                        <Input
                            id="block-message"
                            placeholder="Enter a message to show on blocked sites"
                            value={blockMessage}
                            onChange={(e) => setBlockMessage(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
