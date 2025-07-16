import { getPrisma } from '@infra/database'
import type { CreateFormInput, UpdateFormInput } from './types'

export const getForms = async (owner_id: number, count: number = 10, offset: number = 0) => {
  const prisma = getPrisma()
  
  return prisma.form.findMany({
    where: { owner_id },
    take: count,
    skip: offset,
    orderBy: { updated_at: 'desc' },
    select: {
      id: true,
      owner_id: true,
      title: true,
      updated_at: true,
    }
  })
}

export const getForm = async (form_id: string) => {
  const prisma = getPrisma()

  return prisma.form.findUnique({
    where: { id: form_id },
    select: {
      id: true,
      owner_id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
      notifications: true,
    }
  })
}

export const createForm = async (owner_id: number, data: CreateFormInput) => {
  const prisma = getPrisma()
  
  return prisma.form.create({
    data: {
      ...data,
      owner_id
    },
    select: {
      id: true,
    }
  })
}

export const updateForm = async (form_id: string, owner_id: number, data: UpdateFormInput) => {
  const prisma = getPrisma()

  return prisma.form.update({
    where: { id: form_id, owner_id },
    data,
    select: {
      id: true,
      owner_id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
    }
  })
}

export const deleteForm = async (form_id: string, owner_id: number) => {
  const prisma = getPrisma()

  return prisma.form.delete({
    where: { id: form_id, owner_id },
    select: {
      id: true,
    }
  })
}

export const countUserForms = async (owner_id: number) => {
  const prisma = getPrisma()
  
  return prisma.form.count({
    where: { owner_id }
  })
}