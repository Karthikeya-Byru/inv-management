package com.inventoryapp.service;

import com.inventoryapp.repository.ProductRepository;
import com.inventoryapp.repository.SaleRepository;

import com.inventoryapp.model.Sale;
import com.inventoryapp.model.SaleItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Date;

@Service
public class InvoiceService {

    public byte[] generateInvoicePdf(Sale sale) {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);

            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Date: " + new Date()));
            document.add(new Paragraph("Sale ID: " + sale.getId()));
            document.add(new Paragraph(" "));

            // Table with items
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3, 2, 2, 2});

            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

            table.addCell(new PdfPCell(new Phrase("Product ID", headFont)));
            table.addCell(new PdfPCell(new Phrase("Quantity", headFont)));
            table.addCell(new PdfPCell(new Phrase("Price", headFont)));
            table.addCell(new PdfPCell(new Phrase("Total", headFont)));

            for (SaleItem item : sale.getItems()) {
                table.addCell(String.valueOf(item.getProductId()));
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell("₹" + item.getPrice());
                table.addCell("₹" + (item.getPrice() * item.getQuantity()));
            }

            document.add(table);

            // Total amount
            document.add(new Paragraph(" "));
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Paragraph total = new Paragraph("Total Amount: ₹" + sale.getTotalAmount(), totalFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}