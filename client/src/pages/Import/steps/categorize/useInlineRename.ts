import { useState } from 'react';

const useInlineRename = (currentName: string, onRename: (name: string) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentName);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedName(currentName);
    setIsEditing(true);
  };

  const commitEdit = () => {
    setIsEditing(false);

    if (editedName.trim() !== currentName) {
      onRename(editedName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      setEditedName(currentName);
      setIsEditing(false);
    }
  };

  return { isEditing, editedName, setEditedName, startEdit, commitEdit, handleKeyDown };
};

export default useInlineRename;
