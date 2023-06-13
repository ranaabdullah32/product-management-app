import { Injectable } from '@angular/core';
import { Product } from './interfaces/product.interface';
import { Category } from './interfaces/category.interface';
import { Vendor } from './interfaces/vendor.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private products: Product[] = [];
  private vendors: Vendor[] = [];
  private categories: Category[] = [];

  addVendor(vendor: Vendor) {
    this.vendors.push(vendor);
  }
  getProductById(productId: string): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
  
  getAllVendors() {
    return this.vendors;
  }

  addCategory(category: Category) {
    this.categories.push(category);
  }

  getAllCategories() {
    return this.categories;
  }

  addProduct(product: Product) {
    this.products.push(product);
    return 'Product added successfully!';
  }

  getAllProducts() {
    return this.products;
  }
  
  getCheapProducts(maxPrice: number): Product[] {
    return this.products.filter(product => product.price < maxPrice);
  }
 getProductsByName(productName: string): Product[] {
    return this.products.filter(product => product.name === productName);
  }
  getCategoryProducts(categoryName: string): Product[] {
    const category = this.categories.find(category => category.name === categoryName);
    if (category) {
      return this.products.filter(product => product.category_id === category.id);
    } else {
      return [];
    }
  }
  getVendorProducts(vendorFirstName: string, vendorLastName: string): Product[] {
    const vendorId = this.getVendorIdByNames(vendorFirstName, vendorLastName);
    if (vendorId) {
      return this.products.filter((product) => product.vendor_id === vendorId);
    }
    return [];
  }

  private getVendorIdByNames(vendorFirstName: string, vendorLastName: string): string {
    const vendor = this.vendors.find(
      (vendor) =>
        vendor.first_name.toLowerCase() === vendorFirstName.toLowerCase() ||
        vendor.last_name.toLowerCase() === vendorLastName.toLowerCase()
    );
    return vendor ? vendor.id : '';
  }
}
