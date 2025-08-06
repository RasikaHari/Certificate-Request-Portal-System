package com.examly.springapp.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class PdfGeneratorUtil {

    public static ByteArrayInputStream generateCertificate(String name, String course, String completionDate) {
        Document document = new Document(PageSize.A4, 50, 50, 70, 50); // Margins: left, right, top, bottom
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Set background border rectangle (optional)
            PdfContentByte canvas = writer.getDirectContent();
            Rectangle border = new Rectangle(36, 36, 559, 806); // Slightly inside the page
            border.setBorder(Rectangle.BOX);
            border.setBorderWidth(2);
            border.setBorderColor(BaseColor.DARK_GRAY);
            canvas.rectangle(border);

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, BaseColor.BLACK);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLUE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.DARK_GRAY);

            // Title
            Paragraph title = new Paragraph("Certificate of Completion", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30f);
            document.add(title);

            // Body Content
            Paragraph body = new Paragraph();
            body.setAlignment(Element.ALIGN_CENTER);
            body.add(new Paragraph("This is to certify that", bodyFont));
            body.add(new Paragraph(name, subtitleFont));
            body.add(new Paragraph("has successfully completed the course", bodyFont));
            body.add(new Paragraph(course, subtitleFont));
            body.add(new Paragraph("on " + completionDate, bodyFont));
            body.setSpacingAfter(30f);
            document.add(body);

            // Issuer details
            Paragraph issuer = new Paragraph();
            issuer.setAlignment(Element.ALIGN_RIGHT);
            issuer.setSpacingBefore(100f);
            issuer.add(new Paragraph("Issued by: Certificate Authority", bodyFont));
            issuer.add(new Paragraph("Date of Issue: " + java.time.LocalDate.now(), bodyFont));
            document.add(issuer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
