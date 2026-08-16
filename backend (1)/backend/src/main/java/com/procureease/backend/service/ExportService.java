package com.procureease.backend.service;

import com.procureease.backend.dto.ExportProductResponse;
import com.procureease.backend.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final ProductService productService;

    // ============================================================
    // Get Products For Export
    // ============================================================

    private List<ExportProductResponse> getProductsForExport() {

        ProductService.ProductPageResponse result =
                productService.getAllProducts(
                        "",
                        null,
                        null,
                        null,
                        "name",
                        "ASC",
                        1,
                        100000
                );

        return result.data()
                .stream()
                .map(this::mapToExportResponse)
                .toList();
    }

    // ============================================================
    // Export Products as CSV
    // ============================================================

    public byte[] exportProductsCSV()
            throws IOException {

        List<ExportProductResponse> products =
                getProductsForExport();

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        OutputStreamWriter writer =
                new OutputStreamWriter(
                        outputStream,
                        StandardCharsets.UTF_8
                );

        CSVFormat csvFormat =
                CSVFormat.DEFAULT.builder()
                        .setHeader(
                                "ID",
                                "Name",
                                "Description",
                                "Price",
                                "Stock",
                                "Vendor"
                        )
                        .build();

        try (
                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                csvFormat
                        )
        ) {

            for (ExportProductResponse product :
                    products) {

                csvPrinter.printRecord(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getStock(),
                        product.getVendorName()
                );
            }
        }

        return outputStream.toByteArray();
    }

    // ============================================================
    // Export Products as Excel
    // ============================================================

    public byte[] exportProductsExcel()
            throws IOException {

        List<ExportProductResponse> products =
                getProductsForExport();

        try (
                Workbook workbook =
                        new XSSFWorkbook()
        ) {

            Sheet sheet =
                    workbook.createSheet("Products");

            // Header
            Row headerRow =
                    sheet.createRow(0);

            String[] headers = {
                    "ID",
                    "Name",
                    "Description",
                    "Price",
                    "Stock",
                    "Vendor"
            };

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                headerRow
                        .createCell(i)
                        .setCellValue(headers[i]);
            }

            // Data
            int rowIndex = 1;

            for (ExportProductResponse product :
                    products) {

                Row row =
                        sheet.createRow(rowIndex++);

                row.createCell(0)
                        .setCellValue(
                                product.getId()
                        );

                row.createCell(1)
                        .setCellValue(
                                product.getName()
                        );

                row.createCell(2)
                        .setCellValue(
                                product.getDescription()
                        );

                row.createCell(3)
                        .setCellValue(
                                product.getPrice()
                                        .doubleValue()
                        );

                row.createCell(4)
                        .setCellValue(
                                product.getStock()
                        );

                row.createCell(5)
                        .setCellValue(
                                product.getVendorName()
                        );
            }

            // Match Node.js column widths
            sheet.setColumnWidth(
                    0,
                    10 * 256
            );

            sheet.setColumnWidth(
                    1,
                    30 * 256
            );

            sheet.setColumnWidth(
                    2,
                    40 * 256
            );

            sheet.setColumnWidth(
                    3,
                    15 * 256
            );

            sheet.setColumnWidth(
                    4,
                    15 * 256
            );

            sheet.setColumnWidth(
                    5,
                    30 * 256
            );

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            workbook.write(outputStream);

            return outputStream.toByteArray();
        }
    }

    // ============================================================
    // Export Products as PDF
    // ============================================================

    public byte[] exportProductsPDF()
            throws IOException {

        List<ExportProductResponse> products =
                getProductsForExport();

        try (
                PDDocument document =
                        new PDDocument()
        ) {

            PDPage page =
                    new PDPage(PDRectangle.A4);

            document.addPage(page);

            PDPageContentStream contentStream =
                    new PDPageContentStream(
                            document,
                            page
                    );

            // Title
            contentStream.beginText();

            contentStream.setFont(
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA_BOLD
                    ),
                    20
            );

            contentStream.newLineAtOffset(
                    200,
                    800
            );

            contentStream.showText(
                    "Products Report"
            );

            contentStream.endText();

            float y = 760;

            for (ExportProductResponse product :
                    products) {

                // Create new page when required
                if (y < 80) {

                    contentStream.close();

                    page =
                            new PDPage(
                                    PDRectangle.A4
                            );

                    document.addPage(page);

                    contentStream =
                            new PDPageContentStream(
                                    document,
                                    page
                            );

                    y = 800;
                }

                y = writePDFLine(
                        contentStream,
                        "id",
                        product.getId(),
                        y
                );

                y = writePDFLine(
                        contentStream,
                        "name",
                        product.getName(),
                        y
                );

                y = writePDFLine(
                        contentStream,
                        "description",
                        product.getDescription(),
                        y
                );

                y = writePDFLine(
                        contentStream,
                        "price",
                        product.getPrice(),
                        y
                );

                y = writePDFLine(
                        contentStream,
                        "stock",
                        product.getStock(),
                        y
                );

                y = writePDFLine(
                        contentStream,
                        "vendor_name",
                        product.getVendorName(),
                        y
                );

                y -= 15;
            }

            contentStream.close();

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            document.save(outputStream);

            return outputStream.toByteArray();
        }
    }

    // ============================================================
    // PDF Line Helper
    // ============================================================

    private float writePDFLine(
            PDPageContentStream contentStream,
            String key,
            Object value,
            float y
    ) throws IOException {

        contentStream.beginText();

        contentStream.setFont(
                new PDType1Font(
                        Standard14Fonts.FontName.HELVETICA
                ),
                12
        );

        contentStream.newLineAtOffset(
                50,
                y
        );

        contentStream.showText(
                key + ": " + String.valueOf(value)
        );

        contentStream.endText();

        return y - 15;
    }

    // ============================================================
    // Convert ProductResponse → ExportProductResponse
    // ============================================================

    private ExportProductResponse mapToExportResponse(
            ProductResponse product
    ) {

        return ExportProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .vendorName(product.getVendorName())
                .build();
    }
}