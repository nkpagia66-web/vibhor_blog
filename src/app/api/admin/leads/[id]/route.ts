/**
 * /api/admin/leads/[id] — PATCH status/details, DELETE (archive), and
 * POST notes attached to the lead.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession, UnauthorizedError } from '@/lib/auth';
import { leadStatusSchema, leadNoteSchema } from '@/lib/validation';
import { z } from 'zod';

async function guard() {
  try {
    await requireSession();
    return null;
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    throw e;
  }
}

const patchSchema = z.object({
  status: leadStatusSchema.optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;

  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = leadNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Note cannot be empty.' }, { status: 400 });
  }

  try {
    const note = await prisma.leadNote.create({ data: { leadId: id, body: parsed.data.body } });
    return NextResponse.json({ ok: true, note });
  } catch {
    return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
  }
}
