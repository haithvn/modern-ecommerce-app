package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.Catalog;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CatalogRepository;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final CatalogRepository catalogRepository;
  private final CategoryRepository categoryRepository;
  private final ProductRepository productRepository;

  @Override
  public void run(String... args) throws Exception {
    if (catalogRepository.count() == 0) {
      // Create Catalog
      Catalog electronics = new Catalog();
      electronics.setName("Electronics");
      electronics.setDescription("Electronic devices and gadgets");
      catalogRepository.save(electronics);

      // Create Category
      Category laptops = new Category();
      laptops.setName("Laptops");
      laptops.setCatalog(electronics);
      categoryRepository.save(laptops);

      // Create Products
      Product p1 = new Product();
      p1.setName("MacBook Pro M3");
      p1.setDescription("Apple M3 Chip, 14 inch");
      p1.setPrice(new BigDecimal("1599.00"));
      p1.setCurrency("USD");
      p1.setCategory(laptops);
      p1.setImageUrl("https://via.placeholder.com/150");

      Product p2 = new Product();
      p2.setName("Dell XPS 13");
      p2.setDescription("Intel Core i7, 13 inch");
      p2.setPrice(new BigDecimal("1299.00"));
      p2.setCurrency("USD");
      p2.setCategory(laptops);
      p2.setImageUrl("https://via.placeholder.com/150");

      productRepository.saveAll(Arrays.asList(p1, p2));

      System.out.println("--- Data Seeder Executed Successfully ---");
    }
  }
}
