import React, { useState } from "react";
import { Paper, TextField } from "@mui/material";
import SearchButton from "../../../components/ui/SearchButton";
import {
  useAllCategoryQuery,
  useCreateCategoryMutation,
} from "../../../redux/features/api";
import Loading from "../../../components/ui/Loading";
import toast from "react-hot-toast";

function Category() {
  const [category, setCategory] = useState("");

  const { data: allCategory, isLoading } = useAllCategoryQuery();

  const [createCategory, { isLoading: categoryLoading }] =
    useCreateCategoryMutation();

  console.log(allCategory, "data");

  const hanldelAddtoCategory = async () => {


    if(!category)
    {
      toast("Please Enter your category");
      return;
    }


   
    console.log(category);
    try {
      const res = await createCategory({ name: category }).unwrap();
      console.log(res, "category");
      toast("Category add successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-6">
      <section className="flex flex-col md:flex-row gap-4 md:gap-x-6 mb-6">
        <TextField
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Add your category ..."
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton
          onClick={hanldelAddtoCategory}
          title={categoryLoading ? "Adding" : "Add"}
        />
      </section>

      <h3 className="font-bold md:text-2xl text-black mt-8 md:mt-12">
        All Added Categories
      </h3>

      <Paper elevation={2} className="p-4 mt-6 min-h-96">
        {isLoading ? (
          <div>
            <p>loading</p>
          </div>
        ) : (
          <section className="flex flex-wrap gap-4">
            {allCategory.map((item, key) => (
              <div
                key={key}
                className="flex items-center border bg-white shadow-sm border-gray-300 rounded-md px-2 py-1"
              >
                <p className="text-black text-center px-2">{item.name}</p>

                <button className="ml-2  font-bold">X</button>
              </div>
            ))}
          </section>
        )}
      </Paper>
    </div>
  );
}

export default Category;
