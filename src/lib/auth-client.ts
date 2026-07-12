import { createAuthClient } from 'better-auth/react'
import { nextCookies } from 'better-auth/next-js'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
    plugins: [
        nextCookies(),
        inferAdditionalFields<typeof auth>(),
    ],
})