package com.procureease.backend.service;

import com.procureease.backend.dto.DashboardResponse;
import com.procureease.backend.dto.InventoryDistributionResponse;
import com.procureease.backend.dto.LowStockProductResponse;
import com.procureease.backend.dto.MonthlySalesResponse;
import com.procureease.backend.dto.PurchaseTrendResponse;
import com.procureease.backend.dto.RecentPurchaseOrderResponse;
import com.procureease.backend.dto.RecentSaleResponse;
import com.procureease.backend.dto.TopProductResponse;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.PurchaseOrderRepository;
import com.procureease.backend.repository.SaleRepository;
import com.procureease.backend.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Month;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VendorRepository vendorRepository;

    private final ProductRepository productRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final SaleRepository saleRepository;

    // ============================================================
    // Dashboard Summary
    // ============================================================

    public DashboardResponse getDashboard() {

        long vendors = vendorRepository.count();

        long products = productRepository.count();

        long purchaseOrders = purchaseOrderRepository.count();

        long sales = saleRepository.count();

        BigDecimal inventoryValue =
                productRepository.findAll()
                        .stream()
                        .map(product ->
                                product.getPrice()
                                        .multiply(
                                                BigDecimal.valueOf(
                                                        product.getStock()
                                                )
                                        )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        List<LowStockProductResponse> lowStockProducts =
                productRepository.findAll()
                        .stream()
                        .filter(product ->
                                product.getStock() < 10
                        )
                        .sorted(
                                Comparator.comparing(
                                        Product::getStock
                                )
                        )
                        .map(product ->
                                LowStockProductResponse.builder()
                                        .id(product.getId())
                                        .name(product.getName())
                                        .stock(product.getStock())
                                        .build()
                        )
                        .toList();

        List<RecentSaleResponse> recentSales =
                saleRepository.findAllSalesWithProduct()
                        .stream()
                        .limit(5)
                        .map(sale ->
                                RecentSaleResponse.builder()
                                        .id(sale.getId())
                                        .productId(
                                                sale.getProduct().getId()
                                        )
                                        .quantity(sale.getQuantity())
                                        .price(sale.getPrice())
                                        .totalAmount(
                                                sale.getTotalAmount()
                                        )
                                        .createdAt(
                                                sale.getCreatedAt()
                                        )
                                        .build()
                        )
                        .toList();

        List<RecentPurchaseOrderResponse>
                recentPurchaseOrders =
                purchaseOrderRepository.findAll()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        PurchaseOrder::getId
                                ).reversed()
                        )
                        .limit(5)
                        .map(purchaseOrder ->
                                RecentPurchaseOrderResponse.builder()
                                        .id(
                                                purchaseOrder.getId()
                                        )
                                        .vendorId(
                                                purchaseOrder
                                                        .getVendor()
                                                        .getId()
                                        )
                                        .totalAmount(
                                                purchaseOrder
                                                        .getTotalAmount()
                                        )
                                        .status(
                                                purchaseOrder
                                                        .getStatus()
                                        )
                                        .createdAt(
                                                purchaseOrder
                                                        .getCreatedAt()
                                        )
                                        .build()
                        )
                        .toList();

        return DashboardResponse.builder()
                .vendors(vendors)
                .products(products)
                .purchaseOrders(purchaseOrders)
                .sales(sales)
                .inventoryValue(inventoryValue)
                .lowStockProducts(lowStockProducts)
                .recentSales(recentSales)
                .recentPurchaseOrders(recentPurchaseOrders)
                .build();
    }

    // ============================================================
    // Monthly Sales
    // ============================================================

    public List<MonthlySalesResponse> getMonthlySales() {

        List<Sale> sales =
                saleRepository.findAllSalesWithProduct();

        Map<Integer, BigDecimal> monthlySales =
                sales.stream()
                        .collect(
                                Collectors.groupingBy(
                                        sale ->
                                                sale.getCreatedAt()
                                                        .getMonthValue(),

                                        Collectors.reducing(
                                                BigDecimal.ZERO,
                                                Sale::getTotalAmount,
                                                BigDecimal::add
                                        )
                                )
                        );

        return monthlySales.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry ->
                        MonthlySalesResponse.builder()
                                .monthNumber(entry.getKey())
                                .month(
                                        Month.of(
                                                entry.getKey()
                                        ).name()
                                )
                                .sales(entry.getValue())
                                .build()
                )
                .toList();
    }

    // ============================================================
    // Purchase Trends
    // ============================================================

    public List<PurchaseTrendResponse> getPurchaseTrends() {

        Map<Integer, Long> purchaseTrends =
                purchaseOrderRepository.findAll()
                        .stream()
                        .collect(
                                Collectors.groupingBy(
                                        purchaseOrder ->
                                                purchaseOrder
                                                        .getCreatedAt()
                                                        .getMonthValue(),

                                        Collectors.counting()
                                )
                        );

        return purchaseTrends.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry ->
                        PurchaseTrendResponse.builder()
                                .monthNumber(entry.getKey())
                                .month(
                                        Month.of(
                                                entry.getKey()
                                        ).name()
                                )
                                .purchases(entry.getValue())
                                .build()
                )
                .toList();
    }

    // ============================================================
    // Top Products
    // ============================================================

    public List<TopProductResponse> getTopProducts() {

        return saleRepository.findAllSalesWithProduct()
                .stream()
                .collect(
                        Collectors.groupingBy(
                                sale ->
                                        sale.getProduct()
                                                .getName(),

                                Collectors.summingLong(
                                        Sale::getQuantity
                                )
                        )
                )
                .entrySet()
                .stream()
                .sorted(
                        Map.Entry
                                .<String, Long>comparingByValue()
                                .reversed()
                )
                .limit(5)
                .map(entry ->
                        TopProductResponse.builder()
                                .product(entry.getKey())
                                .quantity(entry.getValue())
                                .build()
                )
                .toList();
    }

    // ============================================================
    // Inventory Distribution
    // ============================================================

    public List<InventoryDistributionResponse>
    getInventoryDistribution() {

        Map<String, Long> distribution =
                productRepository.findAll()
                        .stream()
                        .collect(
                                Collectors.groupingBy(
                                        product ->
                                                product.getStock() < 10
                                                        ? "Low Stock"
                                                        : "Healthy Stock",

                                        Collectors.counting()
                                )
                        );

        return distribution.entrySet()
                .stream()
                .map(entry ->
                        InventoryDistributionResponse.builder()
                                .category(entry.getKey())
                                .count(entry.getValue())
                                .build()
                )
                .toList();
    }
}