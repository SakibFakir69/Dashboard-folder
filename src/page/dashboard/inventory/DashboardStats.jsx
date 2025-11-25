import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/ui/CardComponent";
import { FiBook, FiBox, FiLayers } from "react-icons/fi";
import InventoryTable from "../../../components/ui/InventoryTable";
import { useAllInventoryQuery } from "../../../redux/features/api";

function DashboardStats() {
  const { data: allInventory } = useAllInventoryQuery();

  const [totalItems, setTotalItems] = useState("");
  const [category, setCategory] = useState([]);
  const [ stock , setStock ] = useState(0);

 
 useEffect(() => {
  if (allInventory) {
    
    const uniqueCategories = [...new Set(allInventory.map((item) => item.category))];
    setCategory(uniqueCategories);
    
    const totalItems = allInventory.length;

   
    const total = allInventory.reduce((acc, item) => acc + Number(item.number), 0);
    setStock(total)
    setTotalItems(totalItems);
  }
}, [allInventory]); 

  

  const [inventoryList, setInventoryList] = useState([
    { name: "Headphone", category: "IT", priority: "High", number: 10 },
    { name: "Keyboard", category: "IT", priority: "Medium", number: 5 },
    { name: "Mouse", category: "IT", priority: "Low", number: 15 },
    { name: "Monitor", category: "IT", priority: "High", number: 2 },
    { name: "Keyboard", category: "IT", priority: "Medium", number: 5 },
    { name: "Mouse", category: "IT", priority: "Low", number: 15 },
    { name: "Monitor", category: "IT", priority: "High", number: 2 },
  ]);

  return (
    <div className="w-full text-black p-4 md:p-6 flex flex-col justify-center -mr-10 h-screen">
      {/* Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <CardComponent
          Icon={<FiBox size={28} />}
          number={totalItems}
          title="Total Items"
        />
        <CardComponent
          Icon={<FiLayers size={28} />}
          number={category.length}
          title="Total Category"
        />
        <CardComponent
          Icon={<FiBook size={28} />}
          number={stock}
          title="Total Stock"
        />
      </section>

      <h3 className="font-bold md:text-2xl mb-4">New add Inventory</h3>

      <div className="w-full overflow-auto ">
        <InventoryTable inventoryData={inventoryList} />
      </div>
    </div>
  );
}

export default DashboardStats;
