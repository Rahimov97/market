import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Dialog } from '@mui/material';
import { getProducts, uploadProduct, deleteProduct } from '../services/api';
import { AxiosError } from 'axios';

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    category: string;
    price: string;
    image: File | null;
  }>({
    name: '',
    category: '',
    price: '',
    image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', (error as AxiosError).message);
      }
    };

    fetchProducts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image) {
      alert('Please fill in all fields!');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('price', String(parseFloat(newProduct.price)));
    formData.append('image', newProduct.image);

    try {
      const response = await uploadProduct(formData);
      console.log('Product uploaded:', response);
      setNewProduct({ name: '', category: '', price: '', image: null });
      setIsDialogOpen(false);
      alert('Product added successfully!');
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error adding product:', axiosError.response?.data || axiosError.message);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        alert('Product deleted successfully!');
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
        Add Product
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <TextField
            label="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input type="file" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleAddProduct}>
            Submit
          </Button>
        </Box>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.offers?.[0]?.price || 'N/A'}₽</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDeleteProduct(product._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminPanel;
