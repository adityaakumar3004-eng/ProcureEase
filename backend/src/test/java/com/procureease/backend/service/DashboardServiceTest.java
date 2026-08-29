package com.procureease.backend.service;

import com.procureease.backend.dto.*;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.PurchaseOrderRepository;
import com.procureease.backend.repository.SaleRepository;
import com.procureease.backend.repository.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private SaleRepository saleRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private Vendor vendor;
    private Product product1;
    private Product product2;
    private Sale sale1;
    private Sale sale2;
    private PurchaseOrder purchaseOrder1;
    private PurchaseOrder purchaseOrder2;

    @BeforeEach
    void setUp() {

        // ========================================================
        // Vendor
        // ========================================================

        vendor = Vendor.builder()
                .id(1)
                .name("ABC Suppliers")
                .email("abc@test.com")
                .phone("9876543210")
                .address("Mumbai")
                .build();

        // ========================================================
        // Products
        // ========================================================

        product1 = Product.builder()
                .id(1)
                .name("Laptop")
                .price(new BigDecimal("50000"))
                .stock(5)
                .vendor(vendor)
                .build();

        product2 = Product.builder()
                .id(2)
                .name("Mouse")
                .price(new BigDecimal("1000"))
                .stock(20)
                .vendor(vendor)
                .build();

        // ========================================================
        // Sales
        // ========================================================

        sale1 = Sale.builder()
                .id(1)
                .product(product1)
                .quantity(2)
                .price(new BigDecimal("50000"))
                .totalAmount(new BigDecimal("100000"))
                .createdAt(
                        LocalDateTime.of(
                                2026, 1, 10,
                                10, 0
                        )
                )
                .build();

        sale2 = Sale.builder()
                .id(2)
                .product(product2)
                .quantity(3)
                .price(new BigDecimal("1000"))
                .totalAmount(new BigDecimal("3000"))
                .createdAt(
                        LocalDateTime.of(
                                2026, 2, 15,
                                10, 0
                        )
                )
                .build();

        // ========================================================
        // Purchase Orders
        // ========================================================

        purchaseOrder1 = PurchaseOrder.builder()
                .id(1)
                .vendor(vendor)
                .totalAmount(new BigDecimal("50000"))
                .status("Pending")
                .createdAt(
                        LocalDateTime.of(
                                2026, 1, 5,
                                10, 0
                        )
                )
                .build();

        purchaseOrder2 = PurchaseOrder.builder()
                .id(2)
                .vendor(vendor)
                .totalAmount(new BigDecimal("25000"))
                .status("Approved")
                .createdAt(
                        LocalDateTime.of(
                                2026, 2, 10,
                                10, 0
                        )
                )
                .build();
    }

    // ============================================================
    // Test 1: Dashboard Summary Counts + Inventory Value
    // ============================================================

    @Test
    void getDashboard_ShouldReturnCorrectSummary() {

        when(vendorRepository.count()).thenReturn(1L);
        when(productRepository.count()).thenReturn(2L);
        when(purchaseOrderRepository.count()).thenReturn(2L);
        when(saleRepository.count()).thenReturn(2L);

        when(productRepository.findAll())
                .thenReturn(List.of(product1, product2));

        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(List.of(sale1, sale2));

        when(purchaseOrderRepository.findAll())
                .thenReturn(
                        List.of(
                                purchaseOrder1,
                                purchaseOrder2
                        )
                );

        DashboardResponse response =
                dashboardService.getDashboard();

        assertNotNull(response);

        assertEquals(1L, response.getVendors());
        assertEquals(2L, response.getProducts());
        assertEquals(2L, response.getPurchaseOrders());
        assertEquals(2L, response.getSales());

        // 50000 * 5 + 1000 * 20 = 270000
        assertEquals(
                new BigDecimal("270000"),
                response.getInventoryValue()
        );
    }

    // ============================================================
    // Test 2: Low Stock Products Filtered and Sorted
    // ============================================================

    @Test
    void getDashboard_ShouldReturnLowStockProductsSorted() {

        Product lowStock1 = Product.builder()
                .id(1)
                .name("Laptop")
                .stock(5)
                .price(BigDecimal.ONE)
                .build();

        Product lowStock2 = Product.builder()
                .id(2)
                .name("Keyboard")
                .stock(2)
                .price(BigDecimal.ONE)
                .build();

        Product healthyStock = Product.builder()
                .id(3)
                .name("Mouse")
                .stock(20)
                .price(BigDecimal.ONE)
                .build();

        when(vendorRepository.count()).thenReturn(0L);
        when(productRepository.count()).thenReturn(3L);
        when(purchaseOrderRepository.count()).thenReturn(0L);
        when(saleRepository.count()).thenReturn(0L);

        when(productRepository.findAll())
                .thenReturn(
                        List.of(
                                lowStock1,
                                healthyStock,
                                lowStock2
                        )
                );

        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(List.of());

        when(purchaseOrderRepository.findAll())
                .thenReturn(List.of());

        DashboardResponse response =
                dashboardService.getDashboard();

        List<LowStockProductResponse> lowStock =
                response.getLowStockProducts();

        assertEquals(2, lowStock.size());

        assertEquals(
                "Keyboard",
                lowStock.get(0).getName()
        );

        assertEquals(
                2,
                lowStock.get(0).getStock()
        );

        assertEquals(
                "Laptop",
                lowStock.get(1).getName()
        );

        assertEquals(
                5,
                lowStock.get(1).getStock()
        );
    }

    // ============================================================
    // Test 3: Recent Sales Limited to Five
    // ============================================================

    @Test
    void getDashboard_ShouldLimitRecentSalesToFive() {

        List<Sale> sales = List.of(
                createSale(1),
                createSale(2),
                createSale(3),
                createSale(4),
                createSale(5),
                createSale(6)
        );

        when(vendorRepository.count()).thenReturn(0L);
        when(productRepository.count()).thenReturn(0L);
        when(purchaseOrderRepository.count()).thenReturn(0L);
        when(saleRepository.count()).thenReturn(6L);

        when(productRepository.findAll())
                .thenReturn(List.of());

        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(sales);

        when(purchaseOrderRepository.findAll())
                .thenReturn(List.of());

        DashboardResponse response =
                dashboardService.getDashboard();

        assertEquals(
                5,
                response.getRecentSales().size()
        );
    }

    // ============================================================
    // Test 4: Recent Purchase Orders Sorted and Limited
    // ============================================================

    @Test
    void getDashboard_ShouldSortRecentPurchaseOrdersByIdDescending() {

        List<PurchaseOrder> orders = List.of(
                createPurchaseOrder(1),
                createPurchaseOrder(3),
                createPurchaseOrder(2),
                createPurchaseOrder(6),
                createPurchaseOrder(5),
                createPurchaseOrder(4)
        );

        when(vendorRepository.count()).thenReturn(0L);
        when(productRepository.count()).thenReturn(0L);
        when(purchaseOrderRepository.count()).thenReturn(6L);
        when(saleRepository.count()).thenReturn(0L);

        when(productRepository.findAll())
                .thenReturn(List.of());

        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(List.of());

        when(purchaseOrderRepository.findAll())
                .thenReturn(orders);

        DashboardResponse response =
                dashboardService.getDashboard();

        List<RecentPurchaseOrderResponse> recentOrders =
                response.getRecentPurchaseOrders();

        assertEquals(5, recentOrders.size());

        assertEquals(
                6,
                recentOrders.get(0).getId()
        );

        assertEquals(
                2,
                recentOrders.get(4).getId()
        );
    }

    // ============================================================
    // Test 5: Monthly Sales Grouping
    // ============================================================

    @Test
    void getMonthlySales_ShouldGroupSalesByMonth() {

        Sale januarySale1 =
                Sale.builder()
                        .product(product1)
                        .totalAmount(
                                new BigDecimal("1000")
                        )
                        .createdAt(
                                LocalDateTime.of(
                                        2026, 1, 10,
                                        10, 0
                                )
                        )
                        .build();

        Sale januarySale2 =
                Sale.builder()
                        .product(product1)
                        .totalAmount(
                                new BigDecimal("2000")
                        )
                        .createdAt(
                                LocalDateTime.of(
                                        2026, 1, 20,
                                        10, 0
                                )
                        )
                        .build();

        Sale februarySale =
                Sale.builder()
                        .product(product2)
                        .totalAmount(
                                new BigDecimal("500")
                        )
                        .createdAt(
                                LocalDateTime.of(
                                        2026, 2, 10,
                                        10, 0
                                )
                        )
                        .build();

        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(
                        List.of(
                                februarySale,
                                januarySale1,
                                januarySale2
                        )
                );

        List<MonthlySalesResponse> response =
                dashboardService.getMonthlySales();

        assertEquals(2, response.size());

        assertEquals(
                1,
                response.get(0).getMonthNumber()
        );

        assertEquals(
                "JANUARY",
                response.get(0).getMonth()
        );

        assertEquals(
                new BigDecimal("3000"),
                response.get(0).getSales()
        );

        assertEquals(
                2,
                response.get(1).getMonthNumber()
        );

        assertEquals(
                new BigDecimal("500"),
                response.get(1).getSales()
        );
    }

    // ============================================================
    // Test 6: Purchase Trends Grouping
    // ============================================================

    @Test
    void getPurchaseTrends_ShouldGroupPurchaseOrdersByMonth() {

        PurchaseOrder januaryOrder1 =
                createPurchaseOrderWithDate(
                        1,
                        LocalDateTime.of(
                                2026, 1, 5,
                                10, 0
                        )
                );

        PurchaseOrder januaryOrder2 =
                createPurchaseOrderWithDate(
                        2,
                        LocalDateTime.of(
                                2026, 1, 20,
                                10, 0
                        )
                );

        PurchaseOrder marchOrder =
                createPurchaseOrderWithDate(
                        3,
                        LocalDateTime.of(
                                2026, 3, 10,
                                10, 0
                        )
                );

        when(purchaseOrderRepository.findAll())
                .thenReturn(
                        List.of(
                                marchOrder,
                                januaryOrder1,
                                januaryOrder2
                        )
                );

        List<PurchaseTrendResponse> response =
                dashboardService.getPurchaseTrends();

        assertEquals(2, response.size());

        assertEquals(
                1,
                response.get(0).getMonthNumber()
        );

        assertEquals(
                "JANUARY",
                response.get(0).getMonth()
        );

        assertEquals(
                2L,
                response.get(0).getPurchases()
        );

        assertEquals(
                3,
                response.get(1).getMonthNumber()
        );

        assertEquals(
                1L,
                response.get(1).getPurchases()
        );
    }

    // ============================================================
    // Test 7: Top Products Ranking
    // ============================================================

    @Test
    void getTopProducts_ShouldGroupAndSortProductsByQuantity() {

        Sale laptopSale1 =
                createSaleWithProductAndQuantity(
                        "Laptop",
                        3
                );

        Sale laptopSale2 =
                createSaleWithProductAndQuantity(
                        "Laptop",
                        2
                );

        Sale mouseSale =
                createSaleWithProductAndQuantity(
                        "Mouse",
                        8
                );

        Sale keyboardSale =
                createSaleWithProductAndQuantity(
                        "Keyboard",
                        4
                );

        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(
                        List.of(
                                laptopSale1,
                                mouseSale,
                                keyboardSale,
                                laptopSale2
                        )
                );

        List<TopProductResponse> response =
                dashboardService.getTopProducts();

        assertEquals(3, response.size());

        assertEquals(
                "Mouse",
                response.get(0).getProduct()
        );

        assertEquals(
                8L,
                response.get(0).getQuantity()
        );

        assertEquals(
                "Laptop",
                response.get(1).getProduct()
        );

        assertEquals(
                5L,
                response.get(1).getQuantity()
        );

        assertEquals(
                "Keyboard",
                response.get(2).getProduct()
        );

        assertEquals(
                4L,
                response.get(2).getQuantity()
        );
    }

    // ============================================================
    // Test 8: Inventory Distribution
    // ============================================================

    @Test
    void getInventoryDistribution_ShouldClassifyProductsCorrectly() {

        Product lowStock1 =
                Product.builder()
                        .id(1)
                        .name("Laptop")
                        .stock(5)
                        .build();

        Product lowStock2 =
                Product.builder()
                        .id(2)
                        .name("Keyboard")
                        .stock(2)
                        .build();

        Product healthyStock =
                Product.builder()
                        .id(3)
                        .name("Mouse")
                        .stock(20)
                        .build();

        when(productRepository.findAll())
                .thenReturn(
                        List.of(
                                lowStock1,
                                lowStock2,
                                healthyStock
                        )
                );

        List<InventoryDistributionResponse>
                response =
                dashboardService
                        .getInventoryDistribution();

        assertEquals(2, response.size());

        InventoryDistributionResponse lowStock =
                response.stream()
                        .filter(item ->
                                item.getCategory()
                                        .equals("Low Stock")
                        )
                        .findFirst()
                        .orElseThrow();

        InventoryDistributionResponse healthy =
                response.stream()
                        .filter(item ->
                                item.getCategory()
                                        .equals("Healthy Stock")
                        )
                        .findFirst()
                        .orElseThrow();

        assertEquals(2L, lowStock.getCount());

        assertEquals(1L, healthy.getCount());
    }

    // ============================================================
    // Helper Methods
    // ============================================================

    private Sale createSale(Integer id) {

        return Sale.builder()
                .id(id)
                .product(product1)
                .quantity(1)
                .price(new BigDecimal("100"))
                .totalAmount(new BigDecimal("100"))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private PurchaseOrder createPurchaseOrder(
            Integer id
    ) {

        return PurchaseOrder.builder()
                .id(id)
                .vendor(vendor)
                .totalAmount(new BigDecimal("1000"))
                .status("Pending")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private PurchaseOrder createPurchaseOrderWithDate(
            Integer id,
            LocalDateTime createdAt
    ) {

        return PurchaseOrder.builder()
                .id(id)
                .vendor(vendor)
                .totalAmount(new BigDecimal("1000"))
                .status("Pending")
                .createdAt(createdAt)
                .build();
    }

    private Sale createSaleWithProductAndQuantity(
            String productName,
            Integer quantity
    ) {

        Product product =
                Product.builder()
                        .name(productName)
                        .price(new BigDecimal("100"))
                        .stock(100)
                        .build();

        return Sale.builder()
                .product(product)
                .quantity(quantity)
                .price(new BigDecimal("100"))
                .totalAmount(
                        new BigDecimal("100")
                                .multiply(
                                        BigDecimal.valueOf(
                                                quantity
                                        )
                                )
                )
                .createdAt(LocalDateTime.now())
                .build();
    }
}