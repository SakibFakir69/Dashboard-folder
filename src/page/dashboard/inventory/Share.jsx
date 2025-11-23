

import React from 'react'
import { TextField } from '@mui/material'
import SearchButton from '../../../components/ui/SearchButton'
function Share() {


    


  return (
    <div>
        <section className="flex gap-x-6 mb-6 mt-6">
        <TextField
          placeholder="Find name and share with others"
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton onClick={() => {}} title="Add" />
      </section>

    </div>
  )
}

export default Share