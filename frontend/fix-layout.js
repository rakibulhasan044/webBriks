const fs = require('fs');
let file = '../frontend/src/app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import QueryProviders from "@/providers/QueryProvider";',
  'import QueryProviders from "@/providers/QueryProvider";\nimport { ThemeProvider } from "@/providers/ThemeProvider";'
);

content = content.replace(
  '<html\n      lang="en"\n      className={`${geistSans.variable} ${geistMono.variable} antialiased`}\n    >',
  '<html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>'
);

content = content.replace(
  '<QueryProviders>{children}</QueryProviders>',
  '<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>\n          <QueryProviders>{children}</QueryProviders>\n        </ThemeProvider>'
);

fs.writeFileSync(file, content);
console.log('Fixed layout.tsx');
