import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add } from '@mui/icons-material';
import AddCategoryPopUp from "../components/AddCategoryPopUp";
import CategoryListItem from "../components/CategoryListItem";

function ManagerEditMenu () {
    // on first load, get all categories and render 
    const [openAddCategory, setOpenAddCategory] = React.useState(false);

    return (
        <Box sx={{
            border: 1,
            borderTop: 0,
            display: "flex",
            flexDirection: "row",
            height: "85vh",
            margin: "auto",
            textAlign: "center",
            width: "70vw"
        }}>
            <Box sx={{ borderRight: 1, width: "20vw" }}>
                <Box sx={{ borderBottom: 1, padding: "15px 0"}}>CATEGORIES</Box>
                <Button onClick={() => setOpenAddCategory(true)} sx={{ margin: "10px" }} color="success" variant="outlined">
                    <Add /> New Category
                </Button>
                <Box>
                    {/* After each add, deletion, loop through and rerender list of categories? */}
                    <CategoryListItem category={ "Breakfast" }></CategoryListItem>
                    <CategoryListItem category={ "Lunch" }></CategoryListItem>
                    <CategoryListItem category={ "Dinner" }></CategoryListItem>
                </Box>
                
            </Box>
            <Box sx={{ width: "50vw" }}>
                <Box sx={{ borderBottom: 1, padding: "15px 0" }}>MENU ITEMS</Box>
            </Box>
            {openAddCategory && <AddCategoryPopUp open={openAddCategory} setOpen={setOpenAddCategory}/>}
        </Box>
    )
}

export default ManagerEditMenu;