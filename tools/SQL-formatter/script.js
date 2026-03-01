const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
document.getElementById('format-btn').addEventListener('click', () => {
    let sql = document.getElementById('input').value.trim();
    if (!sql) return;
    // Normalize spaces
    sql = sql.replace(/\s+/g, ' ');
    // Add newlines before major keywords
    const majors = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE', 'UNION'];
    majors.forEach(kw => {
        const re = new RegExp('\\b' + kw + '\\b', 'gi');
        sql = sql.replace(re, '\n' + kw.toUpperCase());
    });
    // Indent sub-clauses
    const lines = sql.split('\n').map(l => l.trim()).filter(l => l);
    const indented = lines.map(l => {
        if (/^(AND|OR|SET|VALUES|ON)\\b/i.test(l)) return '    ' + l;
        return l;
    });
    document.getElementById('output').value = indented.join('\n').trim();
});
document.getElementById('copy-btn').addEventListener('click', () => { const t = document.getElementById('output').value; if (t) navigator.clipboard.writeText(t); });
