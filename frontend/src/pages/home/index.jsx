import { Box, Stack } from "@chakra-ui/react"
import { Cards } from "./cards"
import { Navbar } from "./navbar"
import { TableComponent } from "./table"
import { useState } from "react";

function HomePage() {
  const [refreshCards, setRefreshCards] = useState(0);

  function handleStudentChanged() {
    setRefreshCards((prev) => prev + 1);
  }

  return (
    <Stack colorPalette="pink">
      <Box bg="colorPalette.600" height={240} marginBottom={-44}>
        <Navbar />
      </Box>

      <Stack gap={6}>
        <Cards refresh={refreshCards} />

        <TableComponent onStudentChanged={handleStudentChanged} />
      </Stack>
    </Stack>
  )
}

export default HomePage
