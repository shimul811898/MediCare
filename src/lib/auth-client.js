import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient();



export const { login, register, useSession } = authClient;