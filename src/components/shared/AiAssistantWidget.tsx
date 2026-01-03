
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, Wand2, User, Bot, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Bandhan, your personal wedding content assistant. How can I help you craft the perfect words for your special day?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
          scrollableNode.scrollTo({ top: scrollableNode.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const conversationHistory = [...messages, userMessage];
    setMessages(conversationHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage.content,
                history: messages,
            }),
        });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.reply) {
        const assistantMessage: Message = { role: 'assistant', content: result.reply };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('AI did not return a response.');
      }
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('resource has been exhausted'))) {
        errorMessage = "The AI is currently busy due to high demand. Please wait a moment and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      // Revert to the state before the failed message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      // Refocus the input field after submission
      inputRef.current?.focus();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
            {messages.map((message, index) => (
                <div key={index} className={cn("flex items-end gap-2", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("max-w-[80%] rounded-lg p-3 text-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
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
        <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for ideas or a draft..."
                autoComplete="off"
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
            </Button>
            </form>
        </div>
    </div>
  )
}

export default function AiAssistantWidget() {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();
    
    const sharedTrigger = (
         <Button
            size="icon"
            className="fixed bottom-20 md:bottom-8 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-fade-in-up"
            onClick={() => setOpen(true)}
            >
            <Wand2 className="h-7 w-7" />
        </Button>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>{sharedTrigger}</DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="flex items-center gap-2">
                             <Wand2 className="h-6 w-6 text-primary" />
                             AI Invitation Assistant
                        </DrawerTitle>
                        <DrawerDescription>Let's craft the perfect words for your special occasion.</DrawerDescription>
                    </DrawerHeader>
                     <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="absolute top-3 right-3">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DrawerClose>
                    <div className="overflow-auto flex-1">
                        <AiAssistantChat />
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{sharedTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px] p-0 gap-0 h-[80vh] flex flex-col">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-6 w-6 text-primary" />
                        AI Invitation Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Let's craft the perfect words for your special occasion.
                    </DialogDescription>
                </DialogHeader>
                <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="absolute top-3 right-3">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </DialogClose>
                <div className="flex-1 min-h-0">
                    <AiAssistantChat />
                </div>
            </DialogContent>
        </Dialog>
    )
}
