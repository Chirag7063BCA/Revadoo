const escapePdfText = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const buildTextPdf = (lines) => {
  const safeLines = Array.isArray(lines) ? lines : [String(lines ?? "")];
  const objects = [];

  const pageContent = safeLines
    .map((line, index) => {
      const y = 760 - index * 16;
      return `BT /F1 11 Tf 56 ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");

  const contentStream = `<< /Length ${pageContent.length} >>\nstream\n${pageContent}\nendstream`;

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push(contentStream);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((obj, idx) => {
    offsets.push(pdf.length);
    pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdf;
};

export const downloadPdf = ({ filename, title, sections = [], rows = [], footer = [] }) => {
  const lines = [title, ""];

  sections.forEach((section) => {
    lines.push(section.heading || "Section");
    (section.lines || []).forEach((line) => {
      lines.push(`- ${line}`);
    });
    if (Array.isArray(section.rows) && section.rows.length) {
      section.rows.forEach((row) => {
        lines.push(`  ${row.join(" | ")}`);
      });
    }
    lines.push("");
  });

  if (rows.length) {
    lines.push("Rows:");
    rows.forEach((row) => {
      lines.push(row.join(" | "));
    });
    lines.push("");
  }

  if (footer.length) {
    lines.push("Notes:");
    footer.forEach((line) => lines.push(`- ${line}`));
  }

  const pdf = buildTextPdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "report.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
