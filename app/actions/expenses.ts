'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const description = formData.get('description') as string;
  const amountStr = formData.get('amount') as string;

  if (!description || !amountStr) {
    throw new Error('Description and amount are required.');
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount.');
  }

  const data: any = {
    description,
    amount,
    userId: session.userId,
  };

  // If they have an active project assigned (Manager or Employee)
  if (session.projectId) {
    data.projectId = session.projectId;
  }

  await prisma.expense.create({ data });
  
  // Revalidate paths based on role
  const roleBase = session.role.toLowerCase();
  revalidatePath(`/${roleBase}/expenses`);
  revalidatePath(`/${roleBase}`);
}
