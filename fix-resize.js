const fs = require('fs');

let file = 'frontend/src/components/modules/Dashboard/mobile-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const newEffect = `  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);`;

content = content.replace(
  /\/\/ Prevent background scrolling when open[\s\S]*?}, \[isOpen\]\);/,
  newEffect
);

fs.writeFileSync(file, content);
console.log('Fixed resize');
