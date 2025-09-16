import { TextField, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { Category } from '@/types/Category';
import FormDialog from '@/components/FormDialog';
import { FormProvider, useForm } from 'react-hook-form';

export interface CreateTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void; // callback to parent
}

const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const CreateTransactionDialog = ({ open, onClose, onSubmit }: CreateTransactionDialogProps) => {
  const methods = useForm({
    defaultValues: {
      name: '',
      date: '',
      amount: '',
      recurrence: 'None',
      category: '',
      accountRelated: '',
    },
  });

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

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = (data: any) => {
    console.log(data);
    // e.preventDefault();
    // try {
    //   await axios.post('/transactions', {
    //     ...formData,
    //     amount: Number(formData.amount),
    //     date: new Date(formData.date),
    //   });
    //   onClose();
    // } catch (err) {
    //   console.error('❌ Failed to create transaction:', err);
    // }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={open}
        close={onClose}
        title={'Create Transaction'}
        onSubmit={handleSubmit}
      >
        <Column spacing={2}>
          <Row spacing={2}>
            <TextField fullWidth margin="dense" id="name" name="name" label="Name" />
            <TextField
              fullWidth
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              type="number"
            />
          </Row>
          <Row spacing={2}>
            <TextField
              select
              fullWidth
              margin="dense"
              id="category"
              name="category"
              label="Category"
            >
              {categories?.map(category => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              id="accountRelated"
              name="accountRelated"
              label="Account"
            />
          </Row>
          <Row spacing={2}>
            <TextField
              select
              fullWidth
              margin="dense"
              id="recurrence"
              name="recurrence"
              label="Recurrence"
            >
              {recurrenceOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField fullWidth margin="dense" id="date" name="date" label="Date" type="date" />
          </Row>
        </Column>
      </FormDialog>
    </FormProvider>
  );
};

export default CreateTransactionDialog;
