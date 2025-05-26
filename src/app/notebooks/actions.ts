'use server';

import { db, NewNotebook, notebooks } from '@/drizzle';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createNotebook(data: NewNotebook) {
  await db.insert(notebooks).values(data);
  revalidatePath('/notebooks');
}

export async function deleteNotebook(id: number) {
  await db.delete(notebooks).where(eq(notebooks.id, id));
  revalidatePath('/notebooks');
}
