const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, 'components', 'header.html');
const homeFooterPath = path.join(__dirname, 'components', 'footer.html');
const innerFooterPath = path.join(__dirname, 'components', 'footer-inner.html');

if (!fs.existsSync(headerPath)) {
  console.error("Error: components/header.html not found!");
  process.exit(1);
}

const rawHeaderContent = fs.readFileSync(headerPath, 'utf8').trim();
const homeFooterContent = fs.existsSync(homeFooterPath) ? fs.readFileSync(homeFooterPath, 'utf8').trim() : '';
const innerFooterContent = fs.existsSync(innerFooterPath) ? fs.readFileSync(innerFooterPath, 'utf8').trim() : homeFooterContent;

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const headerRegex = /<!--\s*HEADER:START\s*-->[\s\S]*?<!--\s*HEADER:END\s*-->|<div id="site-header">[\s\S]*?<\/div>|<header class="main-header">[\s\S]*?<\/header>/i;
const footerRegex = /<!--\s*FOOTER:START\s*-->[\s\S]*?<!--\s*FOOTER:END\s*-->|<div id="site-footer">[\s\S]*?<\/div>|<footer[\s\S]*?<\/footer>/i;

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  let dynamicHeader = rawHeaderContent.replace(/<li([^>]*)\bclass="([^"]*)\bcurrent\b([^"]*)"/gi, (match, p1, p2, p3) => {
    const cleanClass = `${p2} ${p3}`.replace(/\s+/g, ' ').trim();
    return cleanClass ? `<li${p1}class="${cleanClass}"` : `<li${p1}`;
  });

  const activeLinkRegex = new RegExp(`(<li(?:\\s+class="([^"]*)")?>\\s*<a\\s+href="${file}")`, 'i');

  if (activeLinkRegex.test(dynamicHeader)) {
    dynamicHeader = dynamicHeader.replace(activeLinkRegex, (match, prefix, existingClasses) => {
      return existingClasses 
        ? match.replace(`class="${existingClasses}"`, `class="${existingClasses} current"`)
        : match.replace('<li', '<li class="current"');
    });
  } else if (file === 'index.html') {
    dynamicHeader = dynamicHeader.replace(/(<li(?:\\s+class="([^"]*)")?>\\s*<a\\s+href="index\.html")/i, (match, prefix, existingClasses) => {
      return existingClasses 
        ? match.replace(`class="${existingClasses}"`, `class="${existingClasses} current"`)
        : match.replace('<li', '<li class="current"');
    });
  }

  const selectedFooter = (file === 'index.html') ? homeFooterContent : innerFooterContent;

  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, `<!-- HEADER:START -->\n${dynamicHeader}\n<!-- HEADER:END -->`);
    modified = true;
  }

  if (selectedFooter && footerRegex.test(html)) {
    html = html.replace(footerRegex, `<!-- FOOTER:START -->\n${selectedFooter}\n<!-- FOOTER:END -->`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Processed: ${file} (Footer: ${file === 'index.html' ? 'Home Footer' : 'Style-Two Footer'})`);
    updatedCount++;
  }
});

console.log(`\nBuild Complete! Successfully updated ${updatedCount} HTML pages.`);