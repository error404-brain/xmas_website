import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//git
export default defineConfig({
  base: "/xmas_website/",
  plugins: [react()],

})
