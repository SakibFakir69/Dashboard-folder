import { Paper } from '@mui/material'
import React from 'react'
import CardComponent from '../../../components/ui/CardComponent'
import { FiBook, FiBox, FiLayers, FiSunset } from 'react-icons/fi'
import InventoryCard from '../../../components/ui/InventoryCard'

function DashboardStats() {
  return (
    <div className='text-black w-full '>



      {/* card section */}

      <section className='grid md:grid-cols-3  md:gap-10 gap-6'>

       <CardComponent Icon={<FiBox size={28}/>} number={100} title='Total Items'/>
       <CardComponent title='Total category' number={8} Icon={<FiLayers size={28}/>}/>
       <CardComponent title='Total Stock' number={150} Icon={<FiBook size={28}/>}/>
      </section>


      {/* list card */}
      <h3 className='font-bold md:text-2xl mt-4 mb-4'>New List Inventory</h3>


      <section className='flex flex-col gap-y-3 overflow-y-scroll h-1/2'>

      {
        Array.from({length:4}).map((num,key)=><InventoryCard key={key} name='Head phone' category='IT' proirity='High'  number={'10'}/>)
      }
      </section>




    </div>
  )
}

export default DashboardStats