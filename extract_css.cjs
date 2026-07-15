const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const adminHtml = fs.readFileSync('admin.html', 'utf8');

const getStyle = (html) => {
    const match = html.match(/<style>([\s\S]*?)<\/style>/);
    return match ? match[1] : '';
};

const indexCss = getStyle(indexHtml);
const adminCss = getStyle(adminHtml);

const combined = `
/* ===== INDEX STYLES ===== */
${indexCss}

/* ===== ADMIN STYLES ===== */
${adminCss}
`;

fs.writeFileSync('src/index.css', combined);
console.log('CSS extracted successfully to src/index.css');
