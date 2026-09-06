const fs = require('fs');

// 1. Revert topbar.tsx
let topbarFile = '../frontend/src/components/modules/Dashboard/topbar.tsx';
let topbarContent = fs.readFileSync(topbarFile, 'utf8');
topbarContent = topbarContent.replace('import { ThemeToggle } from "@/components/shared/ThemeToggle";', '');
topbarContent = topbarContent.replace('<ThemeToggle />', '');
fs.writeFileSync(topbarFile, topbarContent);

// 2. Revert layout.tsx
let layoutFile = '../frontend/src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutFile, 'utf8');
layoutContent = layoutContent.replace('import { ThemeProvider } from "@/providers/ThemeProvider";\n', '');
layoutContent = layoutContent.replace('<html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>', '<html\n      lang="en"\n      className={`${geistSans.variable} ${geistMono.variable} antialiased`}\n    >');
layoutContent = layoutContent.replace(/<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>\s*<QueryProviders>{children}<\/QueryProviders>\s*<\/ThemeProvider>/, '<QueryProviders>{children}</QueryProviders>');
fs.writeFileSync(layoutFile, layoutContent);

// 3. Remove files
try { fs.unlinkSync('../frontend/src/components/shared/ThemeToggle.tsx'); } catch(e){}
try { fs.unlinkSync('../frontend/src/providers/ThemeProvider.tsx'); } catch(e){}

console.log('Reverted JS files');
