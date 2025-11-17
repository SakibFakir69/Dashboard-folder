


import React from 'react'

function Button({title,type}) {
  return (
    <button type={type} className='bg-[#3869EB] text-white h-[40px] w-full rounded' >{title}</button>
  )
}

export default Button