import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

@Injectable()
export class DocService {
  // Generate a PDF with content and return as Buffer
  async generatePdf(content: string): Promise<Buffer> {
    const doc = new PDFDocument();
    let buffers = [];

    // Collect data from the stream as it is generated
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Add content to the PDF
    doc.text(content);

    // Finalize the PDF and end the stream
    doc.end();

    // Return the generated PDF as Buffer
    return Buffer.concat(buffers);
  }

  // You can extend this method to generate more complex PDFs with images, tables, etc.
}
