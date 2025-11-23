import React from 'react'
import { Paper, TextField } from '@mui/material'
import SearchButton from '../../../components/ui/SearchButton'
function Category() {
  return (
    <div>
      <section className="flex gap-x-6 mb-6 mt-6">
        <TextField
          placeholder="Add your category ..."
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton onClick={() => {}} title="Add" />
      </section>
       <h3 className="font-bold md:text-2xl text-black md:mt-18 mt-12">All Added Category</h3>


       <Paper elevation={2} className='min-h-72 p-2 mt-10'>
        <section className='flex w-full mt-10 gap-x-4 rounded '>
        {
          Array.from({length:4}).map((category,key)=>(
            <div className='flex border bg-white shadow border-gray-600/20 rounded  p-1 pr-2'>
            
            <p className='text-black  w-20 text-center p-1'>{key}</p>
            <button>X</button>

            </div>
          ))
        }
       </section>

       </Paper>


    </div>
  )
}

export default Category