


import React from 'react'

function SearchButton({title, onClick}) {
  return (
    <button onClick={onclick} className='h-12 rounded bg-black text-white w-44 md:text-xl md:font-semibold'>{title}</button>
  )
}

export default SearchButton