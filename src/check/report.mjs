export function summarize(results) {
  return {pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL'&&r.severity==='error').length,warn:results.filter(r=>r.status==='WARN'||r.status==='FAIL'&&r.severity==='warn').length,skipped:results.filter(r=>r.status==='SKIPPED'||r.status==='UNREADABLE').length,off:results.filter(r=>r.status==='OFF').length};
}
export function textReport(report) {
  const groups=new Map();
  for(const r of report.results){if(!groups.has(r.reader))groups.set(r.reader,[]);groups.get(r.reader).push(r);}
  const lines=[];for(const [reader,rows]of groups){lines.push(reader);for(const r of rows){lines.push(`${r.status} ${r.id}${r.file?' '+r.file+(r.line?':'+r.line:''):''} ${r.message}`);if(['FAIL','WARN'].includes(r.status))lines.push(`  Why: ${r.why}`,`  Learn: ${r.learn}`);}}
  const s=report.summary;lines.push(`${s.pass} pass, ${s.fail} fail, ${s.warn} warn, ${s.skipped} skipped, ${s.off} off`);return lines.join('\n');
}
export default textReport;
