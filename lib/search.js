"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function searchUsers(query) {
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      include: {
        profile: true,
      },
    });
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}