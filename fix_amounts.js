const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.tsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('e:/BTECH.-CSE/SEM-6/AWT/Project/expense/app');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/expense\.amount\.toFixed\(/g, 'Number(expense.amount).toFixed(');
  content = content.replace(/expense\.amount\.toLocaleString\(/g, 'Number(expense.amount).toLocaleString(');
  content = content.replace(/current\.amount, 0/g, 'Number(current.amount), 0');
  fs.writeFileSync(file, content);
});
console.log('Fixed amount formatting in ' + files.length + ' TSX files.');
