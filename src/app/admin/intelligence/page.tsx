'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, User, Bot, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const examplePrompts = [
    "Show me the last 3 users who signed up.",
    "Who were the last 5 orders from?",
    "Give me the details for the 2 most recent orders.",
    "How many users signed up this week?",
];

function AdminAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am your admin intelligence assistant. How can I help you get insights about your business data today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
          scrollableNode.scrollTo({ top: scrollableNode.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages]);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/admin/intelligence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage.content, history: messages }),
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const result = await response.json();
        if (!result.reply) throw new Error('AI did not return a response.');
        
        const assistantMessage: Message = { role: 'assistant', content: result.reply };
        setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      toast({ title: 'Request Failed', description: error.message, variant: 'destructive' });
      setMessages(prev => prev.slice(0, -1)); // Revert optimistic update
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  
  return (
    <Card className="h-full flex flex-col w-full max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Admin Intelligence
            </CardTitle>
            <CardDescription>Ask questions about your users and orders to get real-time insights.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4 -mx-4" ref={scrollAreaRef}>
                <div className="space-y-4 pr-4">
                {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-end gap-2", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn("max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <p>{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] rounded-lg p-3 text-sm bg-muted flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                 )}
                </div>
            </ScrollArea>
             <div className="text-xs text-muted-foreground p-2 -mx-2">
                Try asking:
                <div className="flex flex-wrap gap-2 mt-2">
                    {examplePrompts.map(prompt => (
                         <Button key={prompt} variant="outline" size="sm" className="text-xs h-auto py-1" onClick={() => sendMessage(prompt)}>
                            {prompt}
                        </Button>
                    ))}
                </div>
            </div>
        </CardContent>
        <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., How many users signed up today?"
                autoComplete="off"
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
            </Button>
            </form>
        </div>
    </Card>
  );
}

export default function AdminIntelligencePage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in-up h-[calc(100vh-60px)]">
           <AdminAssistantChat />
        </main>
    )
}
