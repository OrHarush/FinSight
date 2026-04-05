import { InputBase, Typography, useTheme } from '@mui/material';

interface InlineNameEditorProps {
  name: string;
  isEditing: boolean;
  editedName: string;
  maxWidth?: number | string;
  onEditedNameChange: (value: string) => void;
  onStartEdit: (e: React.MouseEvent) => void;
  onCommitEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const InlineNameEditor = ({
  name,
  isEditing,
  editedName,
  maxWidth = 180,
  onEditedNameChange,
  onStartEdit,
  onCommitEdit,
  onKeyDown,
}: InlineNameEditorProps) => {
  const theme = useTheme();

  if (isEditing) {
    return (
      <InputBase
        value={editedName}
        onChange={e => onEditedNameChange(e.target.value)}
        onBlur={onCommitEdit}
        onKeyDown={onKeyDown}
        autoFocus
        inputProps={{ style: { fontSize: '0.875rem', padding: 0 } }}
        sx={{
          width: '100%',
          maxWidth,
          fontSize: '0.875rem',
          '& input': {
            borderBottom: `1px solid ${theme.palette.primary.main}`,
          },
        }}
      />
    );
  }

  return (
    <Typography
      variant="body2"
      noWrap
      onClick={onStartEdit}
      sx={{
        maxWidth,
        cursor: 'text',
        '&:hover': {
          textDecoration: 'underline dotted',
          textDecorationColor: 'text.disabled',
        },
      }}
    >
      {name || '—'}
    </Typography>
  );
};

export default InlineNameEditor;
