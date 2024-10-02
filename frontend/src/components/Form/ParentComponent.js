import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import FormRow from './FormRow';  // Import FormRow

const ParentComponent = ({ forms }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {forms.map((form) => (
          <FormRow key={form._id} form={form} onDelete={() => {/* Handle delete */}} onShare={() => {/* Handle share */}} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ParentComponent;
