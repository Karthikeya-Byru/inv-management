package com.inventoryapp.dto;

import java.util.List;

public class DashboardResponse {
    private long totalProducts;
    private long totalSales;
    private double totalRevenue;
    private List<RecentSale> recentSales;
    private List<SalesChartData> salesChart;

    // Getters and Setters
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalSales() { return totalSales; }
    public void setTotalSales(long totalSales) { this.totalSales = totalSales; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<RecentSale> getRecentSales() { return recentSales; }
    public void setRecentSales(List<RecentSale> recentSales) { this.recentSales = recentSales; }

    public List<SalesChartData> getSalesChart() { return salesChart; }
    public void setSalesChart(List<SalesChartData> salesChart) { this.salesChart = salesChart; }

    public static class RecentSale {
        private long id;
        private String saleDate;
        private double totalAmount;
        private List<SaleItem> items;

        // Getters and Setters
        public long getId() { return id; }
        public void setId(long id) { this.id = id; }

        public String getSaleDate() { return saleDate; }
        public void setSaleDate(String saleDate) { this.saleDate = saleDate; }

        public double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

        public List<SaleItem> getItems() { return items; }
        public void setItems(List<SaleItem> items) { this.items = items; }
    }

    public static class SaleItem {
        private long productId;
        private int quantity;
        private double price;

        // Getters and Setters
        public long getProductId() { return productId; }
        public void setProductId(long productId) { this.productId = productId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }

    public static class SalesChartData {
        private String date;
        private double total;

        public SalesChartData(String date, double total) {
            this.date = date;
            this.total = total;
        }

        // Getters and Setters
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public double getTotal() { return total; }
        public void setTotal(double total) { this.total = total; }
    }
}