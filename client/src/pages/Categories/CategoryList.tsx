import { useEffect, useState } from 'react';
import { CategoryDto } from '@/types/CategoryDto';
import EditIcon from '@mui/icons-material/Edit';
import CategoryCard from '@/pages/Categories/CategoryCard';
import { Grid } from '@mui/material';

const CategoryList = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Grid container spacing={2}>
      {categories.map(category => (
        <CategoryCard key={category._id} category={category} icon={EditIcon} />
      ))}
    </Grid>
  );
};

export default CategoryList;
