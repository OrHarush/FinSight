import { CategoryFormData } from '@/components/CreateCategoryDialog';
import api from '@/api/axios';
import { useEffect, useState } from 'react';
import { Category } from '@/types/Category';
import Column from '@/components/Layout/Column';
import { Box, Chip, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

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
    <Column>
      <Row spacing={2} flexWrap="wrap">
        {categories.map(cat => (
          <Column
            key={cat._id}
            padding={'4px 24px'}
            sx={{
              alignItems: 'center',
              borderRadius: '30px',
              bgcolor: cat.color,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {cat.name}
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, opacity: 0.9 }}>
              {cat.type}
            </Typography>
          </Column>
        ))}
      </Row>
    </Column>
  );
};

export default CategoryList;
