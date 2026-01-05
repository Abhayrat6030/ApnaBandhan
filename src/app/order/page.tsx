
'use client';

import { Suspense } from 'react';
import OrderFormComponent from './OrderForm';


export default function OrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderFormComponent />
    </Suspense>
  )
}
