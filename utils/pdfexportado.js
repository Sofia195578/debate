import PDFDocument from 'pdfkit';

function exportarConversacionAPDF(mensajes, res) {
  const doc = new PDFDocument();

  // Configurar encabezado HTTP
  res.setHeader('Content-Disposition', 'attachment; filename=conversacion.pdf');
  res.setHeader('Content-Type', 'application/pdf');

  doc.pipe(res);

  doc.fontSize(16).text('Historial de Diálogo entre Expertos', { underline: true });
  doc.moveDown();

  mensajes.forEach(msg => {
    doc.fontSize(12).text(`${msg.autor.toUpperCase()}: ${msg.contenido}`);
    doc.moveDown(0.5);
  });

  doc.end();
}

export default exportarConversacionAPDF;
