import { ColorModeButton } from "../../../components/ui/color-mode";
import { Container, Heading } from "@chakra-ui/react";

export function Navbar() {
  return (
    <div>
      <Container
        maxW="7xl"
        paddingY={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="md" color="colorPalette.100">
          MUAY THAI
        </Heading>

        <ColorModeButton />
      </Container>
    </div>
  );
}
