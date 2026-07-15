const fs = require('fs');

const adminHtml = fs.readFileSync('W:\\فخم\\black&white\\black&white\\admin.html', 'utf8');

const getStyle = (html) => {
    const match = html.match(/<style>([\s\S]*?)<\/style>/);
    return match ? match[1] : '';
};

const adminCss = getStyle(adminHtml);

fs.writeFileSync('w:\\فخم\\blackandwhite\\src\\admin.css', adminCss);
console.log('Admin CSS extracted successfully to w:\\فخم\\blackandwhite\\src\\admin.css');
