


import { Card, CardContent } from '@mui/material'
import React from 'react'

function InventoryCard({name="" , category="", proirity="" , number}) {
  return (
    <Card>

        <CardContent className='px-3 flex  justify-between  items-center'>

            <div>
                <p className='md:font-semibold'>{name}</p>
                <p>{category}</p>
            </div>
            <div>
                {/* gave color based on condition */}
                <p className={`${proirity==='High' ? "text-red-500 font-bold" : proirity==='low' ? "text-green font-bold" :"text-black font-bold" }`}>{proirity}</p>
            </div>
            <div>
                <p className='font-semibold text-xl'>{number}</p>
            </div>


        </CardContent>





    </Card>
  )
}

export default InventoryCard