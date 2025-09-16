import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, FormEvent, useState } from 'react';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import axios from 'axios';

export interface CreateTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void; // callback to parent
}

const categories = ['Groceries', 'Transport', 'Food', 'Investing', 'Salary', 'Entertainment'];
const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const CreateTransactionDialog = ({ open, onClose, onSubmit }: CreateTransactionDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    amount: '',
    recurrence: 'None',
    category: '',
    accountRelated: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/transactions', {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date),
      });
      onClose();
    } catch (err) {
      console.error('❌ Failed to create transaction:', err);
    }
  };
  return (
    <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Create Transaction</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} id="transaction-form">
          <Column spacing={2}>
            <Row spacing={2}>
              <TextField
                fullWidth
                margin="dense"
                id="name"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                id="amount"
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
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
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                margin="dense"
                id="accountRelated"
                name="accountRelated"
                label="Account"
                value={formData.accountRelated}
                onChange={handleChange}
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
                value={formData.recurrence}
                onChange={handleChange}
              >
                {recurrenceOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                margin="dense"
                id="date"
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Row>
          </Column>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" form="transaction-form" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransactionDialog;
