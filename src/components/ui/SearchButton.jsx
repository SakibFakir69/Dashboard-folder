


import React from 'react'

function SearchButton({title, onClick}) {
  return (
    <button onClick={onClick} className='h-12  md:mt-0 bg-blue-600  rounded text-white md:w-44 md:w-36 md:text-xl md:font-semibold w-1/2  '>{title}</button>
  )
}

export default SearchButton