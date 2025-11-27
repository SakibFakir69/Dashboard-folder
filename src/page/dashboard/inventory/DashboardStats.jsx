import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/ui/CardComponent";
import { FiBook, FiBox, FiLayers } from "react-icons/fi";
import InventoryTable from "../../../components/ui/InventoryTable";
import { useAllInventoryQuery } from "../../../redux/features/api";

function DashboardStats() {
  const { data: allInventory } = useAllInventoryQuery();

  const [totalItems, setTotalItems] = useState(0);
  const [category, setCategory] = useState([]);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (allInventory) {
      const uniqueCategories = [...new Set(allInventory.map((item) => item.category))];
      setCategory(uniqueCategories);

      const totalItems = allInventory.length;
      const totalStock = allInventory.reduce((acc, item) => acc + Number(item.number), 0);

      setStock(totalStock);
      setTotalItems(totalItems);
    }
  }, [allInventory]);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 flex flex-col -mr-0 md:-mr-10">
      {/* Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
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

      {/* Inventory Table Section */}
      <h3 className="font-bold text-xl md:text-2xl mb-4 mt-3">New add Inventory</h3>
      <div className="w-full overflow-x-auto">
        <InventoryTable inventoryData={allInventory} />
      </div>
    </div>
  );
}

export default DashboardStats;
