const fs = require('fs');

const indexHtml = fs.readFileSync('W:\\فخم\\black&white\\black&white\\index.html', 'utf8');
const adminHtml = fs.readFileSync('W:\\فخم\\black&white\\black&white\\admin.html', 'utf8');

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

fs.writeFileSync('w:\\فخم\\blackandwhite\\src\\index.css', combined);
console.log('CSS extracted successfully to w:\\فخم\\blackandwhite\\src\\index.css');
