import { User } from "@prisma/client";
import prisma from "../lib/prisma";

export async function findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
}

export async function findUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { username },
    });
    return user;
}

export async function createUser(email: string, username: string, passwordHash: string): Promise<User> {
    const user = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash,
        },
    });
    return user;
}

