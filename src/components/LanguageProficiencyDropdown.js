// LanguageProficiencyDropdown.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function LanguageProficiencyDropdown({ value, onChange }) {
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
      <Select
        labelId="proficiency-label"
        id="proficiency-select"
        value={value}
        onChange={onChange}
        label="Proficiency"
      >
        <MenuItem value="simple">Simple</MenuItem>
        <MenuItem value="intermediate">Intermediate</MenuItem>
        <MenuItem value="advanced">Advanced</MenuItem>
      </Select>
    </FormControl>
  );
}
