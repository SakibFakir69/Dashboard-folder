


import React from 'react'

function AddButton({title, onClick}) {
  return (
    <button onClick={onClick} className='md:h-12 md:w-44 w-36 h-8 rounded md:text-xl bg-black text-white'>{title}</button>
  )
}

export default AddButton