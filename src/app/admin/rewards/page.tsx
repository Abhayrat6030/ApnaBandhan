

'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Coupon } from '@/lib/types';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, PlusCircle, Ticket, Trash2, ToggleLeft, ToggleRight, BadgePercent, IndianRupee, MoreHorizontal, CalendarIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const couponSchema = z.object({
    code: z.string().min(4, 'Code must be at least 4 characters').toUpperCase(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.coerce.number().positive('Value must be positive'),
    expiryDate: z.date({ required_error: "Expiry date is required." }),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function AdminRewardsPage() {
    const { toast } = useToast();
    const db = useFirestore();
    const [isSaving, setIsSaving] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Coupon | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const couponsQuery = useMemoFirebase(() => db ? collection(db, 'coupons') : null, [db]);
    const { data: coupons, isLoading } = useCollection<Coupon>(couponsQuery);

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: '',
            discountType: 'percentage',
        }
    });

    const generateRandomCode = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        form.setValue('code', code);
    }
    
    async function onSubmit(values: CouponFormValues) {
        if (!db) return;
        setIsSaving(true);
        try {
            await addDoc(collection(db, 'coupons'), {
                ...values,
                expiryDate: values.expiryDate.toISOString(),
                isActive: true,
                uses: 0,
                createdAt: new Date().toISOString(),
            });
            toast({ title: "Coupon Created!", description: `Code "${values.code}" has been added.`});
            form.reset({ code: '', discountType: 'percentage' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive'});
        }
        setIsSaving(false);
    }
    
    const handleToggleActive = async (coupon: Coupon) => {
        if(!db) return;
        const couponRef = doc(db, 'coupons', coupon.id);
        await updateDoc(couponRef, { isActive: !coupon.isActive });
        toast({ title: 'Status Updated', description: `Coupon "${coupon.code}" is now ${!coupon.isActive ? 'active' : 'inactive'}.`});
    }

    const handleDelete = async () => {
        if (!itemToDelete || !db) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'coupons', itemToDelete.id));
            toast({ title: 'Coupon Deleted', description: `Coupon "${itemToDelete.code}" has been permanently deleted.`});
        } catch(error: any) {
             toast({ title: 'Error', description: error.message, variant: 'destructive'});
        }
        setItemToDelete(null);
        setIsDeleting(false);
    }


    const sortedCoupons = useMemo(() => {
        if (!coupons) return [];
        return [...coupons].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [coupons]);


    return (
        <>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Create Coupon</CardTitle>
                        <CardDescription>Add a new discount code for your customers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Coupon Code</Label>
                                <div className="flex gap-2">
                                    <Input id="code" placeholder="e.g. DIWALI20" {...form.register('code')} />
                                    <Button type="button" variant="outline" onClick={generateRandomCode}>Generate</Button>
                                </div>
                                {form.formState.errors.code && <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                <Label htmlFor="discountType">Discount Type</Label>
                                <Select onValueChange={(value) => form.setValue('discountType', value as 'percentage' | 'fixed')} defaultValue="percentage">
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>
                                <div className="grid gap-2">
                                <Label htmlFor="discountValue">Value</Label>
                                <Input id="discountValue" type="number" placeholder="e.g. 20 or 500" {...form.register('discountValue')} />
                                {form.formState.errors.discountValue && <p className="text-sm text-destructive">{form.formState.errors.discountValue.message}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Expiry Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("justify-start text-left font-normal", !form.watch('expiryDate') && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {form.watch('expiryDate') ? format(form.watch('expiryDate')!, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={form.watch('expiryDate')}
                                            onSelect={(date) => form.setValue('expiryDate', date as Date)}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {form.formState.errors.expiryDate && <p className="text-sm text-destructive">{form.formState.errors.expiryDate.message}</p>}
                            </div>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                Create Coupon
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-4 overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Manage Coupons</CardTitle>
                        <CardDescription>View, edit, or deactivate existing coupons.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Uses</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center h-24">Loading coupons...</TableCell></TableRow>
                                ) : sortedCoupons && sortedCoupons.length > 0 ? sortedCoupons.map((coupon) => {
                                    const isExpired = new Date(coupon.expiryDate) < new Date();
                                    return (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="font-mono">{coupon.code}</TableCell>
                                        <TableCell>
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={coupon.isActive && !isExpired ? 'default' : 'secondary'} className={cn(isExpired && 'line-through')}>
                                                {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>{coupon.uses}</TableCell>
                                        <TableCell>
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(coupon)}>
                                                        {coupon.isActive ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                                                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => setItemToDelete(coupon)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )}) : (
                                    <TableRow><TableCell colSpan={6} className="text-center h-24">No coupons found.</TableCell></TableRow>
                                )}
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
        
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the coupon <span className="font-bold">{itemToDelete?.code}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
