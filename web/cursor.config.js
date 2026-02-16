// cursor.config.js
import { createClient } from 'https://cdn.cursor.so/sdk.js'

export const cursor = createClient({
  apiKey: process.env.NEXT_PUBLIC_CURSOR_API_KEY,
})
