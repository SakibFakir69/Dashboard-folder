


import React from 'react'

function SearchButton({title, onClick}) {
  return (
    <button onClick={onClick} className='h-12  md:mt-0  rounded bg-black text-white md:w-44 w-36 md:text-xl md:font-semibold'>{title}</button>
  )
}

export default SearchButton