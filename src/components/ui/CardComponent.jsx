import { Card, CardContent } from "@mui/material";

function CardComponent({ title = "", Icon = null, number = "" }) {
const titleColors = {
  "Total Items": { background: "#22C55E", icon: "#FFFFFF" },     
  "Total Category": { background: "#2563EB", icon: "#FFFFFF" },   
  "Total Stock": { background: "#06B6D4", icon: "#ffff"  },      
          
};




const { background, icon } = titleColors[title] || {
  background: "#1F2937", 
  icon: "#FBBF24",       
};

  return (
    <Card
      sx={{
        minHeight: 120,
        cursor: "pointer",
        transition: "0.4s",
        backgroundColor: background,
        color: icon,
      }}
    >
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center pb-6">
          <h3 className="font-semibold md:text-2xl text-xl">{title}</h3>
          <div style={{ color: icon }}>{Icon}</div>
        </div>
        <p className="md:text-2xl text-xl font-bold">{number}</p>
      </CardContent>
    </Card>
  );
}

export default CardComponent;
