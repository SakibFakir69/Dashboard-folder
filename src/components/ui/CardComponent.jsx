import { Card, CardContent } from "@mui/material";

function CardComponent({ title = "", Icon = "", number = "" }) {
  return (
    <Card
      sx={{
        minHeight: "120px",
        cursor: "pointer",
        transition: "0.4s",
        color: "inherit",
        "&:hover": {
          backgroundColor: "black",
          boxShadow: "0px 4px 10px rgba(255,255,255,0.4)",
          color: "white",
        },
      }}
    >
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center pb-6">
          <h3 className="font-semibold md:text-2xl">{title}</h3>

          <div className="text-3xl">{Icon}</div>
        </div>

        <p className="md:text-2xl font-bold">{number}</p>
      </CardContent>
    </Card>
  );
}

export default CardComponent;
