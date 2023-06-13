import { Component } from '@angular/core';
import { ProductsService } from './products.service';
import { Product} from './interfaces/product.interface';
import { Category } from './interfaces/category.interface';
import { Vendor } from './interfaces/vendor.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  filteredProducts: Product[] = []; 
  productName: string = '';
  productPrice: any = 0;
  vendorFirstName: string = '';
  vendorLastName: string = '';
  categoryName: string = '';
  vendorId: any = '';
  categoryId: any = 0;
  products: Product[] = [];
  vendors: Vendor[] = [];
  categories: Category[] = [];
  productNameToDelete: string = '';
  showAddOption: string = '';
  deleteProductId: number = 0;
categorySearch: string = '';
maxPrice: number = 0;
productIdSearch: string = '';
productNameInvalid: boolean = false;
productPriceInvalid: boolean = false;
vendorIdInvalid: boolean = false;
categoryIdInvalid: boolean = false;
isFormValid(): boolean {
  return this.productName && this.productPrice && this.vendorId && this.categoryId;
}

addProduct(): void {
  this.productNameInvalid = false;
  this.productPriceInvalid = false;
  this.vendorIdInvalid = false;
  this.categoryIdInvalid = false;

  if (!this.productName) {
    this.productNameInvalid = true;
  }

  if (!this.productPrice) {
    this.productPriceInvalid = true;
  }

  if (!this.vendorId) {
    this.vendorIdInvalid = true;
  }

  if (!this.categoryId) {
    this.categoryIdInvalid = true;
  }

  if (this.productName && this.productPrice && this.vendorId && this.categoryId) {
    if (this.isFormValid()) {
      const product: Product = {
        id: this.generateId(),
        name: this.productName,
        price: +this.productPrice,
        vendor_id: this.vendorId,
        category_id: this.categoryId,
      } as Product;
      const result = this.productService.addProduct(product);
      console.log(result);
      this.products = this.productService.getAllProducts();
  
      // Reset input fields
      this.productName = '';
      this.productPrice = '';
      this.vendorId = '';
      this.categoryId = '';
      alert('Product added successfully!');
  }
  
  } else {
    alert('Fill Out all the fields first!');
  }
}
searchProductById(): void {
  if (this.productIdSearch) {
    const product = this.productService.getProductById(this.productIdSearch);
    if (product) {
      this.filteredProducts = [product];
    } else {
      this.filteredProducts = [];
    }
  } else {
    this.filteredProducts = [...this.products];
  }
}
searchByCategory() {
  if (this.categorySearch.trim() !== '') {
    this.filteredProducts = this.products.filter((product) => {
      const category = this.categories.find((category) => category.id === product.category_id);
      return category && category.name.toLowerCase().includes(this.categorySearch.toLowerCase());
    });
  } else {
    this.filteredProducts = [];
  }
}

searchByMaxPrice(): void {
  if (this.maxPrice) {
    this.filteredProducts = this.productService.getCheapProducts(this.maxPrice);
  } else {
    this.filteredProducts = this.products;
  }
}
toggleAddOption(option: string): void {
    if (this.showAddOption === option) {
      this.showAddOption = '';
    } else {
      this.showAddOption = option;
    }
  }
  constructor(private productService: ProductsService) {
    this.vendors = this.productService.getAllVendors();
    this.categories = this.productService.getAllCategories();
    this.products = this.productService.getAllProducts();
  }
  addVendor() {
    const vendor: Vendor = {
      id: this.generateId(),
      first_name: this.vendorFirstName,
      last_name: this.vendorLastName,
      contact_number: '',
    };
    this.productService.addVendor(vendor);
    this.vendors = this.productService.getAllVendors();
    this.vendorFirstName = '';
    this.vendorLastName = '';
    alert('Vendor added successfully!');
  }
  addCategory() {
    const category: Category = {
      id: this.generateId(),
      name: this.categoryName,
      status: 'active',
    };
    this.productService.addCategory(category);
    this.categories = this.productService.getAllCategories();
   this.categoryName = '';
    
  alert('Category added successfully!');
  }

 

  
  

  private generateId(): string {
  
    return Math.random().toString(36).substr(2, 9);
  }
  deleteProductById(productId:  string): void {
    const index = this.products.findIndex(product => product.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      alert('Product deleted successfully!');
    }
  }

  deleteProductByName(productName: string) {
    const name = prompt('Enter the name of the product to delete:');
    if (name === productName) {
      const shouldDelete = confirm(`Are you sure you want to delete the product "${productName}"?`);
      if (shouldDelete) {
        const index = this.products.findIndex(product => product.name === name);
        if (index !== -1) {
          this.products.splice(index, 1);
          this.filteredProducts = this.products; 
          alert('Product deleted successfully!');
        }
      }
    } else {
      alert('Product name does not match.');
    }
  }
  
   getCategoryProducts(categoryName: string): Product[] {
    return this.products.filter(product => {
      const category = this.categories.find(category => category.id === product.category_id);
      return category && category.name === categoryName;
    });
  }

  getCheapProducts(maxPrice: number): Product[] {
    return this.products.filter(product => product.price < maxPrice);
  }

  clearAddVendorFields(): void {
    this.vendorFirstName = '';
    this.vendorLastName = '';
  }

  clearAddCategoryField(): void {
    this.categoryName = '';
  }
  clearAddProductFields(): void {
    this.productName = '';
    this.productPrice = undefined;
    this.vendorId = undefined;
    this.categoryId = undefined;
  }
  getVendorName(vendorId: string): string {
    const vendor = this.vendors.find(vendor => vendor.id === vendorId);
    return vendor ? `${vendor.first_name} ${vendor.last_name}` : '';
  }
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(category => category.id === categoryId);
    return category ? category.name : '';
  }
  getProductsByVendor(): void {
    if (this.vendorFirstName || this.vendorLastName) {
      const vendorProducts = this.productService.getVendorProducts(this.vendorFirstName, this.vendorLastName);
      this.filteredProducts = vendorProducts;
    } else {
      this.filteredProducts = this.products;
    }
  }


}
    
